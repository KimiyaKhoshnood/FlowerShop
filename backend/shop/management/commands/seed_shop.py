from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction

from shop.models import Category, Discount, Product

# Images live in frontend/public, so the paths are relative to the Next.js app.
PRODUCTS = [
    ("White Rose", "10.99", "/Flower1Rose.svg", "Roses",
     "A timeless white rose with soft, velvety petals."),
    ("Garden Rose", "10.00", "/Flower2GardenRose.svg", "Roses",
     "Lush, layered petals with an old-fashioned garden charm."),
    ("Pink Tulip", "19.00", "/Flower3PinkTulip.svg", "Tulips",
     "Cheerful pink tulips that open wider every day."),
    ("Gerbera Daisy", "9.00", "/Flower4GerberaDaisy.svg", "Daisy",
     "Big, bright and impossible not to smile at."),
    ("Chrysanthemum", "20.00", "/Flower5Chrysanthemum.svg", "Chrysanthemum",
     "Full, round blooms that last for weeks in a vase."),
    ("Carnation", "4.00", "/Flower6Carnations.svg", "Carnations",
     "Ruffled petals with a light, spicy scent."),
    ("Red Tulip", "15.00", "/Flower7RedTulip.svg", "Tulips",
     "The classic way to say \"I love you\" in spring."),
    ("Orange Tulip", "6.00", "/Flower8OrangeTulip.svg", "Tulips",
     "A warm burst of sunshine for any table."),
    ("Limonium Blue", "1.39", "/Flower9LimoniumBlue.svg", "Fillers",
     "Airy blue clusters that dry beautifully."),
    ("Limonium White", "1.39", "/Flower10LimoniumWhite.svg", "Fillers",
     "Delicate white sprigs to soften any bouquet."),
    ("Purpleish Blue", "2.00", "/Flower11PurpleishBlue.svg", "Iris",
     "Elegant iris in a deep violet-blue."),
    ("Dusty Miller", "1.00", "/Flower12DustyMiller.svg", "Fillers",
     "Silvery, lace-like foliage with a velvet touch."),
    ("Moth Orchid", "2.20", "/Flower13MothOrchid.svg", "Dendrobium",
     "Graceful orchid stems that feel straight out of a greenhouse."),
    ("Spray Roses", "5.80", "/Flower14SprayRoses.svg", "Roses",
     "Several petite roses on every single stem."),
    ("Lisianthus", "6.00", "/Flower15Lisianthus.svg", "Roses",
     "Rose-like ruffles with a lighter, breezier feel."),
    ("Calla Lily White", "3.00", "/Flower16CallaLiliesWhite.svg", "Lilies",
     "Sleek, sculptural and very wedding-ready."),
    ("Asiatic Lily Pink", "2.00", "/Flower17AsiaticLilyPink.svg", "Lilies",
     "Upward-facing pink blooms with no heavy scent."),
    ("Oriental Lily Pink", "4.00", "/Flower18OrientalLilyPink.svg", "Lilies",
     "Big fragrant lilies that fill the whole room."),
    ("Lavender Purple", "6.00", "/Flower19LavenderPurple.svg", "Fillers",
     "Calming purple stems with that famous scent."),
    ("Eucalyptus Parvifolia", "1.50", "/Flower20EucalyptusParvifolia.svg", "Fillers",
     "Fresh, fragrant greenery with tiny round leaves."),
    ("Lavender Pink", "6.00", "/Flower21LavenderPink.svg", "Fillers",
     "A rosy twist on classic lavender."),
    ("Ranunculus Yellow", "6.00", "/Flower22RanunculusYellow.svg", "Ranunculus",
     "Paper-thin petals packed into a sunny yellow ball."),
]

DISCOUNTS = [("OFF5", 5), ("OFF10", 10), ("OFF15", 15)]


class Command(BaseCommand):
    help = "Fill the database with demo flowers, categories, discount codes and an admin user."

    def add_arguments(self, parser):
        parser.add_argument(
            "--no-admin", action="store_true",
            help="Do not create the demo admin/admin12345 superuser.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        for title, price, image, category_name, description in PRODUCTS:
            category, _ = Category.objects.get_or_create(name=category_name)
            Product.objects.update_or_create(
                title=title,
                defaults={
                    "price": Decimal(price),
                    "image": image,
                    "category": category,
                    "description": description,
                },
            )

        for code, percent in DISCOUNTS:
            Discount.objects.update_or_create(code=code, defaults={"percent": percent})

        if not options["no_admin"] and not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "admin12345",
                                          first_name="Flower", last_name="Admin")
            self.stdout.write("Created superuser admin / admin12345")

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(PRODUCTS)} products, {Category.objects.count()} categories "
            f"and {len(DISCOUNTS)} discount codes."
        ))
