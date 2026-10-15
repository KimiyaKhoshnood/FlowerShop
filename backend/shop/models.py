import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_fa = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    description_fa = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=100)
    title_fa = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    description_fa = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='products')
    # Either an absolute URL or a path served by the frontend (e.g. "/Flower1Rose.svg").
    image = models.CharField(max_length=500)

    price = models.DecimalField(max_digits=10, decimal_places=2,
                                validators=[MinValueValidator(Decimal("0.01"))])
    # Set it higher than `price` to show the product as on sale.
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, help_text="Hidden from the shop when unticked.")
    is_featured = models.BooleanField(default=False)

    # Florist details shown on the product page.
    color = models.CharField(max_length=50, blank=True)
    color_fa = models.CharField(max_length=50, blank=True)
    stems_per_bunch = models.PositiveSmallIntegerField(default=10)
    vase_life_days = models.PositiveSmallIntegerField(default=7)
    stem_length_cm = models.PositiveSmallIntegerField(null=True, blank=True)
    head_size_cm = models.PositiveSmallIntegerField(null=True, blank=True)
    # Months (1-12) in which the flower is in season.
    season_months = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(compare_at_price__isnull=True) | models.Q(compare_at_price__gt=models.F("price")),
                name="compare_at_price_above_price",
            ),
        ]

    def __str__(self):
        return self.title

    @property
    def on_sale(self):
        return self.compare_at_price is not None and self.compare_at_price > self.price


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(max_length=1000, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["product", "user"], name="one_review_per_user_and_product"),
        ]

    def __str__(self):
        return f"{self.product} – {self.rating}★ by {self.user}"


class Discount(models.Model):
    code = models.CharField(max_length=20, unique=True)
    percent = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    max_uses = models.PositiveIntegerField(null=True, blank=True, help_text="Leave empty for unlimited.")
    used_count = models.PositiveIntegerField(default=0, editable=False)

    def __str__(self):
        return f"{self.code} ({self.percent}%)"


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending payment"
        PAID = "paid", "Paid"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    class PaymentMethod(models.TextChoices):
        CARD = "card", "Card"
        PAYPAL = "paypal", "PayPal"
        SNAPPPAY = "snapppay", "SnappPay (instalments)"

    # Statuses a customer may still cancel from, and the moves staff may make.
    CANCELLABLE = {Status.PENDING, Status.PAID}
    TRANSITIONS = {
        Status.PENDING: {Status.PAID, Status.CANCELLED},
        Status.PAID: {Status.SHIPPED, Status.CANCELLED},
        Status.SHIPPED: {Status.DELIVERED},
        Status.DELIVERED: set(),
        Status.CANCELLED: set(),
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.CARD)

    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)
    # Snapshots, so later price or code changes never rewrite an old order.
    discount_percent = models.PositiveIntegerField(default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))

    recipient_name = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    city = models.CharField(max_length=80, blank=True)
    address = models.CharField(max_length=255, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    note = models.CharField(max_length=500, blank=True)
    delivery_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.number

    @property
    def number(self):
        """Short, human-friendly order number, e.g. FS-3F2A9C1B."""
        return f"FS-{self.id.hex[:8].upper()}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    product_title = models.CharField(max_length=100, default="")
    product_image = models.CharField(max_length=500, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    qty = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product_title} ({self.qty})"

    @property
    def line_total(self):
        return self.unit_price * self.qty
