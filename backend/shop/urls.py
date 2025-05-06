from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (ProductViewSet, OrderViewSet, DiscountViewSet, CategoryViewSet, TokenObtainPairViewSet, RegisterView
                    , api_root)



router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'discounts', DiscountViewSet)
router.register(r'categories', CategoryViewSet)
# router.register(r'login', TokenObtainPairViewSet)

urlpatterns = [
    path('', api_root),
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
]