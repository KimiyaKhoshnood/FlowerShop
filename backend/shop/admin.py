from django.contrib import admin

from .models import Category, Discount, Order, OrderItem, Product, Review
from .serializers import cancel_order


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "price", "compare_at_price", "stock", "is_active", "is_featured")
    list_editable = ("price", "stock", "is_active", "is_featured")
    list_filter = ("category", "is_active", "is_featured")
    search_fields = ("title", "title_fa", "slug")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "name_fa", "slug")
    search_fields = ("name", "name_fa")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("product__title", "user__username", "comment")


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ("code", "percent", "is_active", "valid_until", "used_count", "max_uses")
    list_filter = ("is_active",)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "product_title", "unit_price", "qty")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("number", "user", "status", "total", "delivery_date", "created_at")
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("id", "user__username", "recipient_name", "phone")
    readonly_fields = ("subtotal", "discount_amount", "shipping_fee", "total", "discount_percent", "created_at")
    inlines = [OrderItemInline]
    actions = ["cancel_orders"]

    @admin.action(description="Cancel selected orders and restock")
    def cancel_orders(self, request, queryset):
        for order in queryset.filter(status__in=Order.CANCELLABLE):
            cancel_order(order)
