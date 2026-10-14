from django.contrib import admin
from .models import Product, Discount, Order, OrderItem, Category


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "price")
    list_filter = ("category",)
    search_fields = ("title",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ("code", "percent")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "discount", "delivery_date", "created_at")
    list_filter = ("created_at",)
    inlines = [OrderItemInline]
