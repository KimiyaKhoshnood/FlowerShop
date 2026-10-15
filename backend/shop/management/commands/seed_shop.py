import random
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from shop.models import Category, Discount, Order, OrderItem, Product, Review
from shop.pricing import money, shipping_fee_for

CATEGORIES = [
    # slug, name, name_fa, description, description_fa
    ("roses", "Roses", "رز", "Classic, romantic and always in style.", "کلاسیک، عاشقانه و همیشه شیک."),
    ("tulips", "Tulips", "لاله", "Spring in a vase.", "بهار در یک گلدان."),
    ("daisy", "Daisy", "دیزی", "Bright faces for happy days.", "گل‌های شاد برای روزهای خوب."),
    ("chrysanthemum", "Chrysanthemum", "داوودی", "Full blooms that last and last.", "گل‌های پرپر و ماندگار."),
    ("carnations", "Carnations", "میخک", "Ruffled petals with a spicy scent.", "گلبرگ‌های چین‌دار با رایحه‌ای تند."),
    ("fillers", "Fillers", "پرکننده‌ها", "Greens and sprigs that finish a bouquet.",
     "شاخه‌ها و برگ‌هایی که دسته‌گل را کامل می‌کنند."),
    ("iris", "Iris", "زنبق", "Elegant blooms in deep blues.", "گل‌های باوقار در رنگ‌های آبی عمیق."),
    ("dendrobium", "Dendrobium", "ارکیده", "Orchids with a tropical touch.", "ارکیده‌هایی با حس استوایی."),
    ("lilies", "Lilies", "لیلیوم", "Big, bold and often fragrant.", "بزرگ، چشمگیر و اغلب خوشبو."),
    ("ranunculus", "Ranunculus", "آلاله", "Layer upon layer of paper-thin petals.", "لایه‌لایه گلبرگ‌های نازک."),
]

SPRING = [2, 3, 4, 5]
ALL_YEAR = list(range(1, 13))
SUMMER = [5, 6, 7, 8, 9]
AUTUMN = [9, 10, 11]

# slug, title, title_fa, category, image, price, compare_at, stock, featured,
# color, color_fa, stems, vase days, stem cm, head cm, season, description, description_fa
PRODUCTS = [
    ("white-rose", "White Rose", "رز سفید", "roses", "/Flower1Rose.svg", "10.99", None, 40, True,
     "White", "سفید", 10, 9, 50, 6, ALL_YEAR,
     "A timeless white rose with soft, velvety petals.", "رزی سفید و همیشگی با گلبرگ‌های مخملی."),
    ("garden-rose", "Garden Rose", "رز باغی", "roses", "/Flower2GardenRose.svg", "10.00", "12.50", 25, True,
     "Blush", "صورتی روشن", 10, 7, 45, 9, SUMMER,
     "Lush, layered petals with an old-fashioned garden charm.", "گلبرگ‌های پرپشت با حال‌وهوای باغ‌های قدیمی."),
    ("pink-tulip", "Pink Tulip", "لاله صورتی", "tulips", "/Flower3PinkTulip.svg", "19.00", "22.00", 30, True,
     "Pink", "صورتی", 10, 7, 40, 5, SPRING,
     "Cheerful pink tulips that open wider every day.", "لاله‌های صورتی شاد که هر روز بازتر می‌شوند."),
    ("gerbera-daisy", "Gerbera Daisy", "ژربرا", "daisy", "/Flower4GerberaDaisy.svg", "9.00", None, 50, False,
     "Orange", "نارنجی", 10, 8, 45, 10, ALL_YEAR,
     "Big, bright and impossible not to smile at.", "بزرگ، رنگی و لبخندآفرین."),
    ("chrysanthemum", "Chrysanthemum", "داوودی", "chrysanthemum", "/Flower5Chrysanthemum.svg", "20.00", None, 18, False,
     "Yellow", "زرد", 10, 14, 60, 8, AUTUMN,
     "Full, round blooms that last for weeks in a vase.", "گل‌های گرد و پرپر که هفته‌ها در گلدان می‌مانند."),
    ("carnation", "Carnation", "میخک", "carnations", "/Flower6Carnations.svg", "4.00", None, 80, False,
     "Red", "قرمز", 20, 14, 50, 6, ALL_YEAR,
     "Ruffled petals with a light, spicy scent.", "گلبرگ‌های چین‌دار با رایحه‌ای ملایم و تند."),
    ("red-tulip", "Red Tulip", "لاله قرمز", "tulips", "/Flower7RedTulip.svg", "15.00", "18.00", 35, True,
     "Red", "قرمز", 10, 7, 40, 5, SPRING,
     "The classic way to say \"I love you\" in spring.", "راه کلاسیک گفتن «دوستت دارم» در بهار."),
    ("orange-tulip", "Orange Tulip", "لاله نارنجی", "tulips", "/Flower8OrangeTulip.svg", "6.00", None, 4, False,
     "Orange", "نارنجی", 10, 7, 40, 5, SPRING,
     "A warm burst of sunshine for any table.", "انفجاری از آفتاب گرم برای هر میز."),
    ("limonium-blue", "Limonium Blue", "لیمونیوم آبی", "fillers", "/Flower9LimoniumBlue.svg", "1.39", None, 120, False,
     "Blue", "آبی", 10, 14, 60, None, ALL_YEAR,
     "Airy blue clusters that dry beautifully.", "خوشه‌های آبی سبک که خشک‌شده‌شان هم زیباست."),
    ("limonium-white", "Limonium White", "لیمونیوم سفید", "fillers", "/Flower10LimoniumWhite.svg", "1.39", None, 120, False,
     "White", "سفید", 10, 14, 60, None, ALL_YEAR,
     "Delicate white sprigs to soften any bouquet.", "شاخه‌های ظریف سفید برای لطیف‌تر کردن هر دسته‌گل."),
    ("purpleish-blue", "Purpleish Blue Iris", "زنبق بنفش", "iris", "/Flower11PurpleishBlue.svg", "2.00", None, 60, False,
     "Purpleish blue", "بنفش مایل به آبی", 10, 5, 55, 7, SPRING,
     "Elegant iris in a deep violet-blue.", "زنبقی باوقار به رنگ بنفش‌آبی عمیق."),
    ("dusty-miller", "Dusty Miller", "داستی میلر", "fillers", "/Flower12DustyMiller.svg", "1.00", None, 0, False,
     "Silver", "نقره‌ای", 10, 10, 35, None, SUMMER,
     "Silvery, lace-like foliage with a velvet touch.", "برگ‌های نقره‌ای و توری با حس مخمل."),
    ("moth-orchid", "Moth Orchid", "ارکیده پروانه‌ای", "dendrobium", "/Flower13MothOrchid.svg", "2.20", None, 45, True,
     "White & purple", "سفید و بنفش", 5, 14, 50, 8, ALL_YEAR,
     "Graceful orchid stems that feel straight out of a greenhouse.", "شاخه‌های ارکیده‌ی دلربا، تازه از گلخانه."),
    ("spray-roses", "Spray Roses", "رز مینیاتوری", "roses", "/Flower14SprayRoses.svg", "5.80", None, 3, False,
     "Peach", "هلویی", 10, 8, 40, 3, ALL_YEAR,
     "Several petite roses on every single stem.", "چند رز کوچک روی هر ساقه."),
    ("lisianthus", "Lisianthus", "لیسیانتوس", "roses", "/Flower15Lisianthus.svg", "6.00", None, 28, False,
     "Lavender", "یاسی", 10, 12, 60, 6, SUMMER,
     "Rose-like ruffles with a lighter, breezier feel.", "چین‌هایی شبیه رز اما سبک‌تر و دلبازتر."),
    ("calla-lily-white", "Calla Lily White", "شیپوری سفید", "lilies", "/Flower16CallaLiliesWhite.svg", "3.00", "3.80", 22, False,
     "White", "سفید", 10, 10, 60, 7, ALL_YEAR,
     "Sleek, sculptural and very wedding-ready.", "خوش‌فرم، مجسمه‌وار و مناسب عروسی."),
    ("asiatic-lily-pink", "Asiatic Lily Pink", "لیلیوم آسیایی صورتی", "lilies", "/Flower17AsiaticLilyPink.svg", "2.00", None, 30, False,
     "Pink", "صورتی", 10, 10, 70, 12, SUMMER,
     "Upward-facing pink blooms with no heavy scent.", "گل‌های صورتی رو به بالا بدون بوی تند."),
    ("oriental-lily-pink", "Oriental Lily Pink", "لیلیوم شرقی صورتی", "lilies", "/Flower18OrientalLilyPink.svg", "4.00", None, 26, True,
     "Pink", "صورتی", 10, 12, 75, 18, SUMMER,
     "Big fragrant lilies that fill the whole room.", "لیلیوم‌های بزرگ و خوشبو که کل اتاق را پر می‌کنند."),
    ("lavender-purple", "Lavender Purple", "اسطوخودوس بنفش", "fillers", "/Flower19LavenderPurple.svg", "6.00", None, 40, False,
     "Purple", "بنفش", 20, 10, 45, None, SUMMER,
     "Calming purple stems with that famous scent.", "شاخه‌های بنفش آرامش‌بخش با همان عطر معروف."),
    ("eucalyptus-parvifolia", "Eucalyptus Parvifolia", "اکالیپتوس", "fillers", "/Flower20EucalyptusParvifolia.svg", "1.50", None, 90, False,
     "Green", "سبز", 10, 14, 60, None, ALL_YEAR,
     "Fresh, fragrant greenery with tiny round leaves.", "سبزینه‌ی تازه و معطر با برگ‌های گرد کوچک."),
    ("lavender-pink", "Lavender Pink", "اسطوخودوس صورتی", "fillers", "/Flower21LavenderPink.svg", "6.00", "7.50", 35, False,
     "Pink", "صورتی", 20, 10, 45, None, SUMMER,
     "A rosy twist on classic lavender.", "نسخه‌ای صورتی از اسطوخودوس کلاسیک."),
    ("ranunculus-yellow", "Ranunculus Yellow", "آلاله زرد", "ranunculus", "/Flower22RanunculusYellow.svg", "6.00", None, 20, True,
     "Yellow", "زرد", 10, 8, 35, 6, SPRING,
     "Paper-thin petals packed into a sunny yellow ball.", "گلبرگ‌های کاغذی در یک گوی زرد آفتابی."),
]

DISCOUNTS = [
    # code, percent, min order, max uses
    ("OFF5", 5, "0", None),
    ("OFF10", 10, "0", None),
    ("OFF15", 15, "30", None),
    ("WELCOME20", 20, "40", 100),
]

DEMO_CUSTOMERS = [
    ("sara", "Sara", "Ahmadi"), ("reza", "Reza", "Karimi"), ("mina", "Mina", "Rahimi"),
    ("emma", "Emma", "Brown"), ("liam", "Liam", "Wilson"),
]

REVIEW_TEXTS = [
    (5, "Arrived fresh and lasted way longer than I expected."),
    (5, "Absolutely gorgeous, everyone asked where I got them!"),
    (4, "Lovely colour, one stem was a little bent but still beautiful."),
    (5, "خیلی تازه و خوش‌رنگ بودن، ممنون!"),
    (4, "بسته‌بندی عالی، فقط کاش زودتر می‌رسید."),
    (3, "Nice, but smaller than in the photo."),
]


class Command(BaseCommand):
    help = "Fill the database with the demo catalogue, discount codes, an admin user and sample orders."

    def add_arguments(self, parser):
        parser.add_argument("--no-admin", action="store_true", help="Skip the admin/admin12345 superuser.")
        parser.add_argument("--no-demo", action="store_true", help="Skip demo customers, reviews and orders.")

    @transaction.atomic
    def handle(self, *args, **options):
        categories = {}
        for slug, name, name_fa, description, description_fa in CATEGORIES:
            categories[slug], _ = Category.objects.update_or_create(
                slug=slug,
                defaults={"name": name, "name_fa": name_fa, "description": description,
                          "description_fa": description_fa},
            )

        for (slug, title, title_fa, category, image, price, compare_at, stock, featured, color, color_fa,
             stems, vase_days, stem_cm, head_cm, season, description, description_fa) in PRODUCTS:
            Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title, "title_fa": title_fa, "category": categories[category], "image": image,
                    "price": Decimal(price), "compare_at_price": Decimal(compare_at) if compare_at else None,
                    "stock": stock, "is_featured": featured, "is_active": True,
                    "color": color, "color_fa": color_fa, "stems_per_bunch": stems, "vase_life_days": vase_days,
                    "stem_length_cm": stem_cm, "head_size_cm": head_cm, "season_months": season,
                    "description": description, "description_fa": description_fa,
                },
            )

        for code, percent, min_order, max_uses in DISCOUNTS:
            Discount.objects.update_or_create(code=code, defaults={
                "percent": percent, "min_order_amount": Decimal(min_order), "max_uses": max_uses, "is_active": True,
            })

        if not options["no_admin"] and not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "admin12345",
                                          first_name="Flower", last_name="Admin")
            self.stdout.write("Created superuser admin / admin12345")

        if not options["no_demo"]:
            self.create_demo_activity()

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(PRODUCTS)} products in {len(CATEGORIES)} categories and {len(DISCOUNTS)} discount codes."
        ))

    def create_demo_activity(self):
        """Customers, reviews and two weeks of orders so the admin charts have something to show."""
        rng = random.Random(42)
        customers = []
        for username, first_name, last_name in DEMO_CUSTOMERS:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={"first_name": first_name, "last_name": last_name, "email": f"{username}@example.com"},
            )
            if created:
                user.set_unusable_password()
                user.save()
            customers.append(user)

        if Order.objects.filter(user__in=customers).exists():
            return  # demo activity was already created

        products = list(Product.objects.filter(is_active=True))
        for product in rng.sample(products, 12):
            for user in rng.sample(customers, rng.randint(1, 3)):
                rating, comment = rng.choice(REVIEW_TEXTS)
                Review.objects.get_or_create(product=product, user=user,
                                             defaults={"rating": rating, "comment": comment})

        now = timezone.now()
        statuses = [Order.Status.DELIVERED] * 5 + [Order.Status.SHIPPED] * 2 + [Order.Status.PAID] * 2 \
            + [Order.Status.PENDING, Order.Status.CANCELLED]
        for _ in range(26):
            created_at = now - timedelta(days=rng.randint(0, 13), hours=rng.randint(0, 20))
            lines = [(product, rng.randint(1, 4)) for product in rng.sample(products, rng.randint(1, 3))]
            subtotal = money(sum(product.price * qty for product, qty in lines))
            user = rng.choice(customers)
            order = Order.objects.create(
                user=user, status=rng.choice(statuses), payment_method=rng.choice(Order.PaymentMethod.values),
                subtotal=subtotal, shipping_fee=shipping_fee_for(subtotal),
                total=subtotal + shipping_fee_for(subtotal),
                recipient_name=user.get_full_name(), phone="+98 912 000 0000", city="Tehran",
                address="Valiasr St.", delivery_date=(created_at + timedelta(days=2)).date(),
            )
            Order.objects.filter(pk=order.pk).update(created_at=created_at)
            OrderItem.objects.bulk_create(
                OrderItem(order=order, product=product, product_title=product.title, product_image=product.image,
                          unit_price=product.price, qty=qty)
                for product, qty in lines
            )
