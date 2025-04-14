from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import ProductViewSet, OrderViewSet, DiscountViewSet, CategoryViewSet, TokenObtainPairViewSet, RegisterView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'discounts', DiscountViewSet)
router.register(r'categories', CategoryViewSet)
# router.register(r'login', TokenObtainPairViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairViewSet.as_view(), name='token_obtain_pair'),
    path('login/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
]