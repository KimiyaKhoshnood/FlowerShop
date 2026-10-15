from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminOrderViewSet, CategoryViewSet, ChangePasswordView, DiscountViewSet, LoginView, OrderViewSet,
    ProductViewSet, RegisterView, StatsView, UserProfileView, api_root,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'discounts', DiscountViewSet, basename='discount')
router.register(r'admin/orders', AdminOrderViewSet, basename='admin-order')

urlpatterns = [
    path('', api_root),
    path('api/', include(router.urls)),
    path('api/admin/stats/', StatsView.as_view(), name='admin_stats'),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/token/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', UserProfileView.as_view(), name='user_profile'),
    path('api/auth/password/', ChangePasswordView.as_view(), name='change_password'),
]
