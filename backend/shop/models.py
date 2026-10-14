from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
import uuid


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # Either an absolute URL or a path served by the frontend (e.g. "/Flower1Rose.svg").
    image = models.CharField(max_length=500)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='products')

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class Discount(models.Model):
    code = models.CharField(max_length=20, unique=True)
    percent = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.code} ({self.percent}%)"


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return str(self.id)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.title} ({self.qty})"
