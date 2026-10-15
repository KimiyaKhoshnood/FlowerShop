from datetime import timedelta
from decimal import Decimal, InvalidOperation

from django.contrib.auth.models import User
from django.db.models import Avg, Count, F, OuterRef, Q, Subquery, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, GenericAPIView, RetrieveUpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Category, Discount, Order, OrderItem, Product, Review
from .permissions import IsAdminOrReadOnly
from .pricing import build_quote, find_discount, money
from .serializers import (
    AdminOrderSerializer, CategorySerializer, ChangePasswordSerializer, DiscountSerializer,
    OrderCreateSerializer, OrderSerializer, ProductSerializer, QuoteRequestSerializer,
    RegisterSerializer, ReviewSerializer, ShopTokenObtainPairSerializer, UserSerializer,
    cancel_order, quote_to_dict,
)


class StandardPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    return Response({
        'products': reverse('product-list', request=request, format=format),
        'categories': reverse('category-list', request=request, format=format),
        'orders': reverse('order-list', request=request, format=format),
        'register': reverse('auth_register', request=request, format=format),
        'login': reverse('token_obtain_pair', request=request, format=format),
        'docs': reverse('schema-swagger-ui', request=request, format=format),
    })


def _decimal_param(request, name):
    value = request.query_params.get(name)
    if value in (None, ""):
        return None
    try:
        return Decimal(value)
    except InvalidOperation:
        raise ValidationError({name: "Must be a number."})


class ProductViewSet(viewsets.ModelViewSet):
    """
    The catalogue. Filters: `q`, `category` (slug), `min_price`, `max_price`,
    `in_stock=1`, `on_sale=1`, `featured=1`, `ids=1,2,3`.
    Sort with `sort=newest|price|-price|rating|popular|title`.
    """
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardPagination
    lookup_field = "slug"

    SORTS = {
        "newest": ["-created_at", "-id"],
        "price": ["price", "id"],
        "-price": ["-price", "id"],
        "rating": [F("rating").desc(nulls_last=True), "-review_count", "id"],
        "popular": ["-sold", "id"],
        "title": ["title"],
    }

    def get_queryset(self):
        params = self.request.query_params
        queryset = Product.objects.select_related("category").annotate(
            rating=Avg("reviews__rating"),
            review_count=Count("reviews", distinct=True),
        )
        # Staff see hidden products in the admin panel (and can open them by slug).
        if not (self.request.user.is_staff and (params.get("all") == "1" or self.action != "list")):
            queryset = queryset.filter(is_active=True)

        if self.action != "list":
            return queryset

        if q := params.get("q", "").strip():
            queryset = queryset.filter(
                Q(title__icontains=q) | Q(title_fa__icontains=q) | Q(description__icontains=q)
                | Q(category__name__icontains=q) | Q(category__name_fa__icontains=q)
            )
        if category := params.get("category"):
            queryset = queryset.filter(category__slug__in=category.split(","))
        if (min_price := _decimal_param(self.request, "min_price")) is not None:
            queryset = queryset.filter(price__gte=min_price)
        if (max_price := _decimal_param(self.request, "max_price")) is not None:
            queryset = queryset.filter(price__lte=max_price)
        if params.get("in_stock") == "1":
            queryset = queryset.filter(stock__gt=0)
        if params.get("on_sale") == "1":
            queryset = queryset.filter(compare_at_price__gt=F("price"))
        if params.get("featured") == "1":
            queryset = queryset.filter(is_featured=True)
        if ids := params.get("ids"):
            try:
                queryset = queryset.filter(pk__in=[int(i) for i in ids.split(",") if i])
            except ValueError:
                raise ValidationError({"ids": "Use a comma separated list of ids."})

        sort = params.get("sort", "newest")
        if sort == "popular":
            sold = OrderItem.objects.filter(product=OuterRef("pk")).exclude(order__status=Order.Status.CANCELLED) \
                .values("product").annotate(total=Sum("qty")).values("total")
            queryset = queryset.annotate(sold=Subquery(sold))
            return queryset.order_by(F("sold").desc(nulls_last=True), "id")
        return queryset.order_by(*self.SORTS.get(sort, self.SORTS["newest"]))

    @action(detail=True, methods=["get", "post"], permission_classes=[AllowAny])
    def reviews(self, request, slug=None):
        product = self.get_object()
        if request.method == "GET":
            reviews = product.reviews.select_related("user")[:50]
            return Response(ReviewSerializer(reviews, many=True).data)

        if not request.user.is_authenticated:
            return Response({"detail": "Log in to write a review."}, status=status.HTTP_401_UNAUTHORIZED)
        existing = Review.objects.filter(product=product, user=request.user).first()
        serializer = ReviewSerializer(existing, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product, user=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK if existing else status.HTTP_201_CREATED)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        first_image = Product.objects.filter(category=OuterRef("pk"), is_active=True) \
            .order_by("-is_featured", "id").values("image")[:1]
        return Category.objects.annotate(
            product_count=Count("products", filter=Q(products__is_active=True)),
            image=Subquery(first_image),
        )


class DiscountViewSet(viewsets.ModelViewSet):
    """Staff manage codes here; anyone can check a code with POST /discounts/validate/."""
    queryset = Discount.objects.order_by("code")
    serializer_class = DiscountSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def validate(self, request):
        code = str(request.data.get("code", "")).strip()
        if not code:
            raise ValidationError({"discount_code": "Enter a code."})
        try:
            subtotal = money(request.data.get("subtotal", "0"))
        except (InvalidOperation, TypeError):
            raise ValidationError({"subtotal": "Must be a number."})
        discount = find_discount(code, subtotal)
        return Response({"code": discount.code, "percent": discount.percent})

    def get_throttles(self):
        if self.action == "validate":
            # Slow down anyone trying to guess codes.
            self.throttle_scope = "discount"
            return [ScopedRateThrottle()]
        return super().get_throttles()


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                   viewsets.GenericViewSet):
    """The signed-in customer's own orders."""
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user) \
            .select_related("discount").prefetch_related("items__product")

    def get_serializer_class(self):
        return OrderCreateSerializer if self.action == "create" else OrderSerializer

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status not in Order.CANCELLABLE:
            raise ValidationError({"status": "This order can no longer be cancelled."})
        cancel_order(order)
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def quote(self, request):
        """Price a bag without placing an order. Works for guests too."""
        serializer = QuoteRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quote = build_quote(serializer.validated_data["items"],
                            serializer.validated_data.get("discount_code") or None)
        return Response(quote_to_dict(quote))


class AdminOrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                        viewsets.GenericViewSet):
    """Every order, for staff. Only `status` can be changed, along the allowed transitions."""
    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardPagination
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        queryset = Order.objects.select_related("user", "discount").prefetch_related("items__product")
        if order_status := self.request.query_params.get("status"):
            queryset = queryset.filter(status=order_status)
        if q := self.request.query_params.get("q", "").strip():
            queryset = queryset.filter(
                Q(user__username__icontains=q) | Q(user__email__icontains=q)
                | Q(recipient_name__icontains=q) | Q(id__icontains=q.lower().removeprefix("fs-"))
            )
        return queryset


class StatsView(APIView):
    """Numbers for the admin overview page."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = 14
        since = timezone.localdate() - timedelta(days=days - 1)
        valid_orders = Order.objects.exclude(status=Order.Status.CANCELLED)

        totals = valid_orders.aggregate(revenue=Sum("total"), orders=Count("id"))
        per_day = {
            row["day"]: row
            for row in valid_orders.filter(created_at__date__gte=since)
            .annotate(day=TruncDate("created_at")).values("day")
            .annotate(revenue=Sum("total"), orders=Count("id"))
        }
        sales_by_day = []
        for offset in range(days):
            day = since + timedelta(days=offset)
            row = per_day.get(day, {})
            sales_by_day.append({"date": day.isoformat(), "revenue": str(money(row.get("revenue") or 0)),
                                 "orders": row.get("orders", 0)})

        top_products = (
            OrderItem.objects.exclude(order__status=Order.Status.CANCELLED)
            .values("product_title").annotate(sold=Sum("qty"), revenue=Sum(F("qty") * F("unit_price")))
            .order_by("-sold")[:5]
        )
        return Response({
            "revenue": str(money(totals["revenue"] or 0)),
            "orders": totals["orders"],
            "average_order": str(money((totals["revenue"] or 0) / totals["orders"])) if totals["orders"] else "0.00",
            "customers": User.objects.filter(is_staff=False).count(),
            "orders_by_status": {
                row["status"]: row["count"]
                for row in Order.objects.values("status").annotate(count=Count("id"))
            },
            "sales_by_day": sales_by_day,
            "top_products": [
                {"title": row["product_title"], "sold": row["sold"], "revenue": str(money(row["revenue"]))}
                for row in top_products
            ],
            "low_stock": list(
                Product.objects.filter(is_active=True, stock__lte=5).order_by("stock")
                .values("id", "slug", "title", "stock")[:10]
            ),
        })


# ---------------------------------------------------------------- accounts

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    throttle_scope = "auth"


class LoginView(TokenObtainPairView):
    serializer_class = ShopTokenObtainPairSerializer
    throttle_scope = "auth"


class UserProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response(status=status.HTTP_204_NO_CONTENT)
