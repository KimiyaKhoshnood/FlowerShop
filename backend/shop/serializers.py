from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Product, Discount, OrderItem, Order, Category


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        slug_field="name"
    )

    class Meta:
        model = Product
        fields = "__all__"


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    qty = serializers.IntegerField(min_value=1)

    class Meta:
        model = OrderItem
        fields = ['product', 'qty']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    discount_percent = serializers.IntegerField(source='discount.percent', read_only=True, allow_null=True)

    class Meta:
        model = Order
        fields = ['id', 'discount', 'discount_percent', 'delivery_date', 'created_at', 'items']
        read_only_fields = ['id', 'created_at']

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("An order needs at least one item.")
        return items

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        OrderItem.objects.bulk_create(OrderItem(order=order, **item) for item in items_data)
        return order


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
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
        fields = ['username', 'email', 'first_name', 'last_name', 'is_staff']
        read_only_fields = ['is_staff']
