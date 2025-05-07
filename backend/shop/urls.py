from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (ProductViewSet, OrderViewSet, DiscountViewSet, CategoryViewSet, RegisterView
                    , api_root, UserProfileViewSet)



router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'discounts', DiscountViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', api_root),
    path('api/', include(router.urls)),
    path('api/profile/', UserProfileViewSet.as_view(), name='user_profile'),
    path('register/', RegisterView.as_view(), name='auth_register'),
]