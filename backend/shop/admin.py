from django.contrib import admin
from .models import Product, Discount, Order, OrderItem, Category


admin.site.register(Product)
admin.site.register(Discount)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Category)