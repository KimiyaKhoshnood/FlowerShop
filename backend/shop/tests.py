from datetime import timedelta
from decimal import Decimal
from io import StringIO

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Discount, Order, Product, Review

TOMORROW = (timezone.localdate() + timedelta(days=1)).isoformat()


def results(response):
    """Unwrap paginated responses."""
    return response.data["results"] if isinstance(response.data, dict) and "results" in response.data else response.data


@override_settings(SHOP_SHIPPING_FEE="5.00", SHOP_FREE_SHIPPING_FROM="50.00")
class ShopAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.roses = Category.objects.create(name="Roses", slug="roses", name_fa="رز")
        cls.tulips = Category.objects.create(name="Tulips", slug="tulips")
        cls.rose = Product.objects.create(title="White Rose", slug="white-rose", price="10.00", image="/r.svg",
                                          category=cls.roses, stock=10, is_featured=True)
        cls.tulip = Product.objects.create(title="Red Tulip", slug="red-tulip", price="4.00", image="/t.svg",
                                           category=cls.tulips, stock=2, compare_at_price="5.00")
        cls.hidden = Product.objects.create(title="Secret", slug="secret", price="1.00", image="/s.svg",
                                            stock=5, is_active=False)
        cls.discount = Discount.objects.create(code="OFF10", percent=10)
        cls.alice = User.objects.create_user("alice", "alice@example.com", "s3cret-pass!")
        cls.bob = User.objects.create_user("bob", "bob@example.com", "s3cret-pass!")
        cls.admin = User.objects.create_superuser("boss", "boss@example.com", "s3cret-pass!")

    def order_payload(self, **extra):
        return {
            "items": [{"product": self.rose.id, "qty": 2}],
            "payment_method": "card",
            "recipient_name": "Alice", "phone": "+98 912 123 4567", "city": "Tehran", "address": "Somewhere 1",
            "delivery_date": TOMORROW,
            **extra,
        }

    def place_order(self, user, **extra):
        self.client.force_authenticate(user)
        return self.client.post("/api/orders/", self.order_payload(**extra), format="json")


class ProductTests(ShopAPITestCase):
    def test_list_is_paginated_and_hides_inactive(self):
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)
        self.assertNotIn("secret", [p["slug"] for p in results(response)])

    def test_detail_by_slug(self):
        response = self.client.get("/api/products/white-rose/")
        self.assertEqual(response.data["category"], "roses")
        self.assertEqual(response.data["category_name_fa"], "رز")
        self.assertTrue(response.data["in_stock"])

    def test_inactive_product_is_404_for_customers_but_visible_to_staff(self):
        self.assertEqual(self.client.get("/api/products/secret/").status_code, status.HTTP_404_NOT_FOUND)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get("/api/products/secret/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get("/api/products/?all=1").data["count"], 3)

    def test_filters(self):
        def slugs(query):
            return [p["slug"] for p in results(self.client.get(f"/api/products/?{query}"))]

        self.assertEqual(slugs("category=tulips"), ["red-tulip"])
        self.assertEqual(slugs("q=rose"), ["white-rose"])
        self.assertEqual(slugs("on_sale=1"), ["red-tulip"])
        self.assertEqual(slugs("featured=1"), ["white-rose"])
        self.assertEqual(slugs("max_price=5"), ["red-tulip"])
        self.assertEqual(slugs("sort=price"), ["red-tulip", "white-rose"])
        self.assertEqual(slugs(f"ids={self.rose.id}"), ["white-rose"])

    def test_bad_price_filter_is_a_400(self):
        self.assertEqual(self.client.get("/api/products/?min_price=abc").status_code, status.HTTP_400_BAD_REQUEST)

    def test_regular_user_cannot_create_product(self):
        self.client.force_authenticate(self.alice)
        response = self.client.post("/api/products/", {"title": "Hack", "slug": "hack", "price": "1", "image": "/x"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_creates_product(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post("/api/products/", {
            "title": "Peony", "slug": "peony", "price": "7.50", "image": "/Peony.svg", "category": "roses",
            "stock": 3, "season_months": [5, 4, 4],
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data["season_months"], [4, 5])

    def test_compare_at_price_must_be_higher(self):
        self.client.force_authenticate(self.admin)
        response = self.client.patch("/api/products/white-rose/", {"compare_at_price": "9.00"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CategoryTests(ShopAPITestCase):
    def test_counts_only_active_products(self):
        response = self.client.get("/api/categories/")
        counts = {c["slug"]: c["product_count"] for c in response.data}
        self.assertEqual(counts, {"roses": 1, "tulips": 1})
        self.assertEqual(response.data[0]["image"], "/r.svg")


class ReviewTests(ShopAPITestCase):
    def test_review_and_update(self):
        self.client.force_authenticate(self.alice)
        url = "/api/products/white-rose/reviews/"
        self.assertEqual(self.client.post(url, {"rating": 4, "comment": "Nice"}).status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.client.post(url, {"rating": 5}).status_code, status.HTTP_200_OK)
        self.assertEqual(Review.objects.get().rating, 5)

        product = self.client.get("/api/products/white-rose/").data
        self.assertEqual((product["rating"], product["review_count"]), (5.0, 1))

    def test_guest_cannot_review(self):
        response = self.client.post("/api/products/white-rose/reviews/", {"rating": 5})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_rating_range(self):
        self.client.force_authenticate(self.alice)
        response = self.client.post("/api/products/white-rose/reviews/", {"rating": 6})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DiscountTests(ShopAPITestCase):
    def validate(self, code, subtotal="10"):
        return self.client.post("/api/discounts/validate/", {"code": code, "subtotal": subtotal})

    def test_valid_code_case_insensitive(self):
        self.assertEqual(self.validate("off10").data, {"code": "OFF10", "percent": 10})

    def test_unknown_inactive_expired_used_up_and_minimum(self):
        Discount.objects.create(code="OLD", percent=5, valid_until=timezone.now() - timedelta(days=1))
        Discount.objects.create(code="OFFLINE", percent=5, is_active=False)
        Discount.objects.create(code="ONCE", percent=5, max_uses=1, used_count=1)
        Discount.objects.create(code="BIG", percent=5, min_order_amount="100")
        for code in ("NOPE", "OLD", "OFFLINE", "ONCE", "BIG"):
            self.assertEqual(self.validate(code).status_code, status.HTTP_400_BAD_REQUEST, code)

    def test_only_staff_lists_codes(self):
        self.client.force_authenticate(self.alice)
        self.assertEqual(self.client.get("/api/discounts/").status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(self.admin)
        self.assertEqual(len(self.client.get("/api/discounts/").data), 1)


class QuoteTests(ShopAPITestCase):
    def test_quote_prices_on_the_server(self):
        response = self.client.post("/api/orders/quote/", {
            "items": [{"product": self.rose.id, "qty": 2}, {"product": self.tulip.id, "qty": 1}],
            "discount_code": "OFF10",
        }, format="json")
        self.assertEqual(response.data["subtotal"], "24.00")
        self.assertEqual(response.data["discount_amount"], "2.40")
        self.assertEqual(response.data["shipping_fee"], "5.00")
        self.assertEqual(response.data["total"], "26.60")
        self.assertEqual(response.data["problems"], [])

    def test_free_shipping_threshold(self):
        response = self.client.post("/api/orders/quote/", {"items": [{"product": self.rose.id, "qty": 5}]},
                                    format="json")
        self.assertEqual(response.data["shipping_fee"], "0.00")

    def test_quote_reports_stock_and_missing_products(self):
        response = self.client.post("/api/orders/quote/", {
            "items": [{"product": self.tulip.id, "qty": 3}, {"product": self.hidden.id, "qty": 1}],
        }, format="json")
        self.assertEqual(len(response.data["problems"]), 2)


class OrderTests(ShopAPITestCase):
    def test_create_order_snapshots_prices_and_updates_stock(self):
        response = self.place_order(self.alice, discount_code="off10")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data["status"], "paid")
        self.assertEqual(response.data["total"], "23.00")  # 20 - 2 + 5 shipping
        self.assertTrue(response.data["number"].startswith("FS-"))

        self.rose.refresh_from_db()
        self.discount.refresh_from_db()
        self.assertEqual(self.rose.stock, 8)
        self.assertEqual(self.discount.used_count, 1)

        # A later price change must not touch the order.
        Product.objects.filter(pk=self.rose.pk).update(price=Decimal("99"))
        order = self.client.get(f"/api/orders/{response.data['id']}/").data
        self.assertEqual(order["items"][0]["unit_price"], "10.00")

    def test_client_cannot_set_prices_or_status(self):
        response = self.place_order(self.alice, total="0.01", status="delivered")
        self.assertEqual(response.data["total"], "25.00")
        self.assertEqual(response.data["status"], "paid")

    def test_snapppay_orders_are_paid(self):
        self.assertEqual(self.place_order(self.alice, payment_method="snapppay").data["status"], "paid")

    def test_unknown_payment_method_is_rejected(self):
        response = self.place_order(self.alice, payment_method="cash")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_not_enough_stock(self):
        response = self.place_order(self.alice, items=[{"product": self.tulip.id, "qty": 3}])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.tulip.refresh_from_db()
        self.assertEqual(self.tulip.stock, 2)

    def test_validation(self):
        for extra in ({"items": []}, {"items": [{"product": self.rose.id, "qty": 0}]},
                      {"delivery_date": timezone.localdate().isoformat()},
                      {"phone": "call me"}, {"discount_code": "NOPE"}):
            response = self.place_order(self.alice, **extra)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, extra)

    def test_users_only_see_their_own_orders(self):
        self.place_order(self.alice)
        bobs = self.place_order(self.bob).data

        self.client.force_authenticate(self.alice)
        self.assertEqual(self.client.get("/api/orders/").data["count"], 1)
        self.assertEqual(self.client.get(f"/api/orders/{bobs['id']}/").status_code, status.HTTP_404_NOT_FOUND)

    def test_cancel_restocks(self):
        order = self.place_order(self.alice, discount_code="OFF10").data
        response = self.client.post(f"/api/orders/{order['id']}/cancel/")
        self.assertEqual(response.data["status"], "cancelled")
        self.rose.refresh_from_db()
        self.discount.refresh_from_db()
        self.assertEqual((self.rose.stock, self.discount.used_count), (10, 0))
        # Cancelling twice is refused.
        self.assertEqual(self.client.post(f"/api/orders/{order['id']}/cancel/").status_code,
                         status.HTTP_400_BAD_REQUEST)

    def test_anonymous_cannot_order(self):
        response = self.client.post("/api/orders/", self.order_payload(), format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AdminOrderTests(ShopAPITestCase):
    def test_staff_moves_status_along_allowed_transitions(self):
        order = self.place_order(self.alice).data
        self.client.force_authenticate(self.admin)
        url = f"/api/admin/orders/{order['id']}/"
        self.assertEqual(self.client.patch(url, {"status": "delivered"}).status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.client.patch(url, {"status": "shipped"}).data["status"], "shipped")
        self.assertEqual(self.client.patch(url, {"status": "delivered"}).data["status"], "delivered")

    def test_staff_cancel_restocks(self):
        order = self.place_order(self.alice).data
        self.client.force_authenticate(self.admin)
        self.client.patch(f"/api/admin/orders/{order['id']}/", {"status": "cancelled"})
        self.rose.refresh_from_db()
        self.assertEqual(self.rose.stock, 10)

    def test_customers_are_kept_out(self):
        self.client.force_authenticate(self.alice)
        self.assertEqual(self.client.get("/api/admin/orders/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get("/api/admin/stats/").status_code, status.HTTP_403_FORBIDDEN)

    def test_stats(self):
        self.place_order(self.alice)
        self.client.force_authenticate(self.admin)
        stats = self.client.get("/api/admin/stats/").data
        self.assertEqual(stats["orders"], 1)
        self.assertEqual(stats["revenue"], "25.00")
        self.assertEqual(len(stats["sales_by_day"]), 14)
        self.assertEqual(stats["top_products"][0]["title"], "White Rose")
        self.assertIn("red-tulip", [p["slug"] for p in stats["low_stock"]])


class AuthTests(ShopAPITestCase):
    def test_register_then_login_with_claims(self):
        response = self.client.post("/api/auth/register/", {
            "username": "carol", "email": "carol@example.com",
            "password": "Petals&Stems42", "password2": "Petals&Stems42",
            "first_name": "Carol", "last_name": "Rose",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertNotIn("password", response.data)

        response = self.client.post("/api/auth/token/", {"username": "carol", "password": "Petals&Stems42"})
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_register_password_mismatch(self):
        response = self.client.post("/api/auth/register/", {
            "username": "dave", "email": "dave@example.com",
            "password": "Petals&Stems42", "password2": "nope",
            "first_name": "Dave", "last_name": "Lily",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password2", response.data)

    def test_profile_staff_flag_is_read_only(self):
        self.client.force_authenticate(self.alice)
        response = self.client.patch("/api/auth/me/", {"is_staff": True, "first_name": "Al"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_staff"])

    def test_change_password(self):
        self.client.force_authenticate(self.alice)
        wrong = self.client.post("/api/auth/password/", {"current_password": "x", "new_password": "N3w-Bouquet!"})
        self.assertEqual(wrong.status_code, status.HTTP_400_BAD_REQUEST)
        ok = self.client.post("/api/auth/password/",
                              {"current_password": "s3cret-pass!", "new_password": "N3w-Bouquet!"})
        self.assertEqual(ok.status_code, status.HTTP_204_NO_CONTENT)
        self.alice.refresh_from_db()
        self.assertTrue(self.alice.check_password("N3w-Bouquet!"))


class SeedCommandTests(APITestCase):
    def test_seed_is_idempotent(self):
        call_command("seed_shop", stdout=StringIO())
        call_command("seed_shop", stdout=StringIO())
        self.assertEqual(Product.objects.count(), 22)
        self.assertEqual(Discount.objects.count(), 4)
        self.assertTrue(Order.objects.exists())
        self.assertTrue(User.objects.filter(username="admin", is_superuser=True).exists())
