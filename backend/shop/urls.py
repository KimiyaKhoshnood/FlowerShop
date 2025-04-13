from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet, DiscountViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'discounts', DiscountViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls))
]