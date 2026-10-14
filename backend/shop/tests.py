from io import StringIO

from django.contrib.auth.models import User
from django.core.management import call_command
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Discount, Order, Product


class ShopAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(name="Roses")
        cls.product = Product.objects.create(
            title="White Rose", price="10.99", image="/Flower1Rose.svg", category=cls.category
        )
        cls.discount = Discount.objects.create(code="OFF10", percent=10)
        cls.alice = User.objects.create_user("alice", "alice@example.com", "s3cret-pass!")
        cls.bob = User.objects.create_user("bob", "bob@example.com", "s3cret-pass!")
        cls.admin = User.objects.create_superuser("boss", "boss@example.com", "s3cret-pass!")


class ProductTests(ShopAPITestCase):
    def test_anyone_can_list_products(self):
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["category"], "Roses")

    def test_filter_by_category(self):
        Product.objects.create(title="Tulip", price="5", image="/t.svg",
                               category=Category.objects.create(name="Tulips"))
        response = self.client.get("/api/products/?category=Tulips")
        self.assertEqual([p["title"] for p in response.data], ["Tulip"])

    def test_regular_user_cannot_create_product(self):
        self.client.force_authenticate(self.alice)
        response = self.client.post("/api/products/", {
            "title": "Hack", "price": "1", "image": "/x.svg", "category": "Roses"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_product_with_relative_image(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post("/api/products/", {
            "title": "Peony", "price": "7.50", "image": "/Peony.svg", "category": "Roses"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)


class DiscountTests(ShopAPITestCase):
    def test_lookup_by_code_is_case_insensitive(self):
        self.client.force_authenticate(self.alice)
        response = self.client.get("/api/discounts/?code=off10")
        self.assertEqual(response.data[0]["percent"], 10)

    def test_wrong_code_returns_nothing(self):
        self.client.force_authenticate(self.alice)
        response = self.client.get("/api/discounts/?code=FREEFLOWERS")
        self.assertEqual(response.data, [])

    def test_regular_user_cannot_list_all_codes(self):
        self.client.force_authenticate(self.alice)
        self.assertEqual(self.client.get("/api/discounts/").data, [])

    def test_admin_can_list_all_codes(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(len(self.client.get("/api/discounts/").data), 1)


class OrderTests(ShopAPITestCase):
    def place_order(self, user, **extra):
        self.client.force_authenticate(user)
        payload = {"items": [{"product": self.product.id, "qty": 2}], **extra}
        return self.client.post("/api/orders/", payload, format="json")

    def test_create_order(self):
        response = self.place_order(self.alice, discount=self.discount.id, delivery_date="2030-01-01")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data["discount_percent"], 10)
        order = Order.objects.get()
        self.assertEqual(order.user, self.alice)
        self.assertEqual(order.discount, self.discount)
        self.assertEqual(order.items.get().qty, 2)

    def test_empty_order_is_rejected(self):
        self.client.force_authenticate(self.alice)
        response = self.client.post("/api/orders/", {"items": []}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_zero_quantity_is_rejected(self):
        self.client.force_authenticate(self.alice)
        response = self.client.post(
            "/api/orders/", {"items": [{"product": self.product.id, "qty": 0}]}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_users_only_see_their_own_orders(self):
        self.place_order(self.alice)
        self.place_order(self.bob)

        self.client.force_authenticate(self.alice)
        response = self.client.get("/api/orders/")
        self.assertEqual(len(response.data), 1)
        self.assertIsNone(response.data[0]["discount_percent"])

        bobs_order = Order.objects.get(user=self.bob)
        response = self.client.get(f"/api/orders/{bobs_order.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_cannot_order(self):
        response = self.client.post("/api/orders/", {"items": []}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthTests(ShopAPITestCase):
    def test_register_then_login(self):
        response = self.client.post("/register/", {
            "username": "carol", "email": "carol@example.com",
            "password": "Petals&Stems42", "password2": "Petals&Stems42",
            "first_name": "Carol", "last_name": "Rose",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertNotIn("password", response.data)

        response = self.client.post("/api/token/", {"username": "carol", "password": "Petals&Stems42"})
        self.assertIn("access", response.data)

    def test_register_password_mismatch(self):
        response = self.client.post("/register/", {
            "username": "dave", "email": "dave@example.com",
            "password": "Petals&Stems42", "password2": "nope",
            "first_name": "Dave", "last_name": "Lily",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password2", response.data)

    def test_profile_exposes_staff_flag_read_only(self):
        self.client.force_authenticate(self.alice)
        response = self.client.patch("/api/profile/", {"is_staff": True, "first_name": "Al"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_staff"])
        self.alice.refresh_from_db()
        self.assertFalse(self.alice.is_staff)


class SeedCommandTests(APITestCase):
    def test_seed_is_idempotent(self):
        call_command("seed_shop", stdout=StringIO())
        call_command("seed_shop", stdout=StringIO())
        self.assertEqual(Product.objects.count(), 22)
        self.assertEqual(Discount.objects.count(), 3)
        self.assertTrue(User.objects.filter(username="admin", is_superuser=True).exists())
