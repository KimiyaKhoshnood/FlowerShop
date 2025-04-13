from rest_framework import viewsets
from .models import Product, Discount, Order
from .serializers import ProductSerializer, DiscountSerializer, OrderSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class DiscountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
