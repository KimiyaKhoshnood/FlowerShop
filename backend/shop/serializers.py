from datetime import timedelta

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Category, Discount, Order, OrderItem, Product, Review
from .pricing import build_quote

MAX_DELIVERY_DAYS_AHEAD = 60


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)
    image = serializers.CharField(read_only=True, allow_null=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'name_fa', 'slug', 'description', 'description_fa', 'product_count', 'image']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(queryset=Category.objects.all(), slug_field="slug",
                                            allow_null=True, required=False)
    category_name = serializers.CharField(source="category.name", read_only=True, allow_null=True)
    category_name_fa = serializers.CharField(source="category.name_fa", read_only=True, allow_null=True)
    rating = serializers.FloatField(read_only=True, allow_null=True)
    review_count = serializers.IntegerField(read_only=True)
    on_sale = serializers.BooleanField(read_only=True)
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'slug', 'title', 'title_fa', 'description', 'description_fa',
            'category', 'category_name', 'category_name_fa', 'image',
            'price', 'compare_at_price', 'on_sale', 'stock', 'in_stock', 'is_active', 'is_featured',
            'color', 'color_fa', 'stems_per_bunch', 'vase_life_days', 'stem_length_cm', 'head_size_cm',
            'season_months', 'rating', 'review_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_in_stock(self, product):
        return product.stock > 0

    def validate_season_months(self, months):
        if not isinstance(months, list) or any(not isinstance(m, int) or not 1 <= m <= 12 for m in months):
            raise serializers.ValidationError("Use a list of month numbers between 1 and 12.")
        return sorted(set(months))

    def validate(self, attrs):
        price = attrs.get("price", getattr(self.instance, "price", None))
        compare_at = attrs.get("compare_at_price", getattr(self.instance, "compare_at_price", None))
        if compare_at is not None and price is not None and compare_at <= price:
            raise serializers.ValidationError({"compare_at_price": "Must be higher than the price to show a sale."})
        return attrs


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'author', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']

    def get_author(self, review):
        return review.user.first_name or review.user.username


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'code', 'percent', 'is_active', 'valid_until', 'min_order_amount', 'max_uses', 'used_count']
        read_only_fields = ['used_count']

    def validate_code(self, code):
        return code.strip().upper()


# ---------------------------------------------------------------- orders

class CartItemSerializer(serializers.Serializer):
    product = serializers.IntegerField(min_value=1)
    qty = serializers.IntegerField(min_value=1, max_value=999)


class QuoteRequestSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True, allow_empty=True)
    discount_code = serializers.CharField(required=False, allow_blank=True, max_length=20)


def quote_to_dict(quote):
    return {
        "lines": [
            {
                "product": line.product.pk,
                "slug": line.product.slug,
                "title": line.product.title,
                "title_fa": line.product.title_fa,
                "image": line.product.image,
                "unit_price": str(line.unit_price),
                "qty": line.qty,
                "stock": line.product.stock,
                "line_total": str(line.line_total),
            }
            for line in quote.lines
        ],
        "discount_code": quote.discount.code if quote.discount else None,
        "discount_percent": quote.discount_percent,
        "subtotal": str(quote.subtotal),
        "discount_amount": str(quote.discount_amount),
        "shipping_fee": str(quote.shipping_fee),
        "total": str(quote.total),
        "problems": quote.problems,
    }


class OrderItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.CharField(source="product.slug", read_only=True, allow_null=True)
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_slug', 'product_title', 'product_image', 'unit_price', 'qty', 'line_total']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    number = serializers.CharField(read_only=True)
    discount_code = serializers.CharField(source="discount.code", read_only=True, allow_null=True)
    can_cancel = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'number', 'status', 'payment_method', 'discount_code', 'discount_percent',
            'subtotal', 'discount_amount', 'shipping_fee', 'total',
            'recipient_name', 'phone', 'city', 'address', 'postal_code', 'note', 'delivery_date',
            'created_at', 'updated_at', 'items', 'can_cancel',
        ]
        read_only_fields = fields

    def get_can_cancel(self, order):
        return order.status in Order.CANCELLABLE


class AdminOrderSerializer(OrderSerializer):
    customer = serializers.SerializerMethodField()

    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ['customer']
        read_only_fields = [f for f in OrderSerializer.Meta.fields if f != 'status'] + ['customer']

    def get_customer(self, order):
        return {"username": order.user.username, "email": order.user.email,
                "name": order.user.get_full_name()}

    def validate_status(self, status):
        current = self.instance.status if self.instance else None
        if current and status != current and status not in Order.TRANSITIONS[current]:
            raise serializers.ValidationError(f"An order can't go from '{current}' to '{status}'.")
        return status

    def update(self, order, validated_data):
        if validated_data.get("status") == Order.Status.CANCELLED and order.status != Order.Status.CANCELLED:
            cancel_order(order)
            return order
        return super().update(order, validated_data)


class OrderCreateSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True)
    discount_code = serializers.CharField(required=False, allow_blank=True, max_length=20)
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)
    recipient_name = serializers.CharField(max_length=120)
    phone = serializers.RegexField(r"^\+?[0-9 ()-]{7,20}$", max_length=30,
                                   error_messages={"invalid": "Enter a valid phone number."})
    city = serializers.CharField(max_length=80)
    address = serializers.CharField(max_length=255)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    note = serializers.CharField(max_length=500, required=False, allow_blank=True)
    delivery_date = serializers.DateField()

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("An order needs at least one item.")
        return items

    def validate_delivery_date(self, value):
        today = timezone.localdate()
        if value <= today:
            raise serializers.ValidationError("Pick a delivery date from tomorrow on.")
        if value > today + timedelta(days=MAX_DELIVERY_DAYS_AHEAD):
            raise serializers.ValidationError(f"Deliveries can be booked up to {MAX_DELIVERY_DAYS_AHEAD} days ahead.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items")
        code = validated_data.pop("discount_code", "") or None
        quote = build_quote(items, code, lock=True)
        if quote.problems:
            raise serializers.ValidationError({"items": quote.problems})

        # Every payment method is an online gateway, mocked here as instantly successful.
        status = Order.Status.PAID
        order = Order.objects.create(
            user=self.context["request"].user,
            status=status,
            discount=quote.discount,
            discount_percent=quote.discount_percent,
            subtotal=quote.subtotal,
            discount_amount=quote.discount_amount,
            shipping_fee=quote.shipping_fee,
            total=quote.total,
            **validated_data,
        )
        OrderItem.objects.bulk_create(
            OrderItem(order=order, product=line.product, product_title=line.product.title,
                      product_image=line.product.image, unit_price=line.unit_price, qty=line.qty)
            for line in quote.lines
        )
        for line in quote.lines:
            Product.objects.filter(pk=line.product.pk).update(stock=F("stock") - line.qty)
        if quote.discount:
            Discount.objects.filter(pk=quote.discount.pk).update(used_count=F("used_count") + 1)
        return order

    def to_representation(self, order):
        return OrderSerializer(order, context=self.context).data


@transaction.atomic
def cancel_order(order):
    """Cancel an order and put its items back in stock."""
    for item in order.items.select_related("product"):
        if item.product_id:
            Product.objects.filter(pk=item.product_id).update(stock=F("stock") + item.qty)
    if order.discount_id:
        Discount.objects.filter(pk=order.discount_id, used_count__gt=0).update(used_count=F("used_count") - 1)
    order.status = Order.Status.CANCELLED
    order.save(update_fields=["status", "updated_at"])


# ---------------------------------------------------------------- accounts

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="An account with this email already exists.")]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password2': 'Passwords must match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined']
        read_only_fields = ['is_staff', 'date_joined']


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Your current password is not correct.")
        return value

    def validate_new_password(self, value):
        validate_password(value, self.context["request"].user)
        return value


class ShopTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds a few harmless claims so the frontend can render without an extra request."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        return token
