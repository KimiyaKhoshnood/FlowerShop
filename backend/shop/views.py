from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Product, Discount, Order, Category
from .serializers import (ProductSerializer, DiscountSerializer, OrderSerializer, CategorySerializer
, TokenObtainPairSerializer, RegisterSerializer, UserSerializer)


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
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset


class DiscountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# SIGN_UP AND LOGIN
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class TokenObtainPairViewSet(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = TokenObtainPairSerializer


class UserProfileViewSet(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
