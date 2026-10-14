from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Product, Discount, Order, Category
from .permissions import IsAdminOrReadOnly
from .serializers import (ProductSerializer, DiscountSerializer, OrderSerializer, CategorySerializer,
                          RegisterSerializer, UserSerializer)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    return Response({
        'products': reverse('product-list', request=request, format=format),
        'orders': reverse('order-list', request=request, format=format),
        'discounts': reverse('discount-list', request=request, format=format),
        'categories': reverse('category-list', request=request, format=format),
        'register': reverse('auth_register', request=request, format=format),
        'login': reverse('token_obtain_pair', request=request, format=format),
    })


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset


class DiscountViewSet(viewsets.ModelViewSet):
    """
    Staff can manage every discount code. Regular users can only look up a
    single code with `?code=...`, so the full list of codes stays secret.
    """
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        code = self.request.query_params.get("code")
        if code:
            return queryset.filter(code__iexact=code)
        if self.request.user.is_staff:
            return queryset
        return queryset.none()


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


# SIGN_UP AND LOGIN
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserProfileViewSet(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
