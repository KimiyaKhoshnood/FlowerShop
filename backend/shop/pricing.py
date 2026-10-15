"""
Server-side price calculation. The frontend only ever *displays* totals;
every amount that ends up on an order is computed here.
"""
from dataclasses import dataclass, field
from decimal import ROUND_HALF_UP, Decimal

from django.conf import settings
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Discount, Product

CENT = Decimal("0.01")


def money(value) -> Decimal:
    return Decimal(value).quantize(CENT, rounding=ROUND_HALF_UP)


@dataclass
class QuoteLine:
    product: Product
    qty: int

    @property
    def unit_price(self) -> Decimal:
        return self.product.price

    @property
    def line_total(self) -> Decimal:
        return money(self.product.price * self.qty)


@dataclass
class Quote:
    lines: list[QuoteLine]
    discount: Discount | None = None
    subtotal: Decimal = Decimal("0")
    discount_amount: Decimal = Decimal("0")
    shipping_fee: Decimal = Decimal("0")
    total: Decimal = Decimal("0")
    problems: list[str] = field(default_factory=list)

    @property
    def discount_percent(self) -> int:
        return self.discount.percent if self.discount else 0


def shipping_fee_for(subtotal: Decimal) -> Decimal:
    if subtotal >= Decimal(settings.SHOP_FREE_SHIPPING_FROM):
        return Decimal("0.00")
    return money(settings.SHOP_SHIPPING_FEE)


def find_discount(code: str, subtotal: Decimal) -> Discount:
    """Return the usable discount for `code` or raise a ValidationError saying why not."""
    discount = Discount.objects.filter(code__iexact=code.strip()).first()
    if discount is None or not discount.is_active:
        raise ValidationError({"discount_code": "This discount code does not exist."}, code="invalid")
    if discount.valid_until and discount.valid_until < timezone.now():
        raise ValidationError({"discount_code": "This discount code has expired."}, code="expired")
    if discount.max_uses is not None and discount.used_count >= discount.max_uses:
        raise ValidationError({"discount_code": "This discount code has been used up."}, code="used_up")
    if subtotal < discount.min_order_amount:
        raise ValidationError(
            {"discount_code": f"This code needs an order of at least ${discount.min_order_amount}."},
            code="min_order",
        )
    return discount


def build_quote(items: list[dict], discount_code: str | None = None, *, lock: bool = False) -> Quote:
    """
    `items` is a list of {"product": <id>, "qty": <int>}. Unknown or inactive
    products and quantities above the stock are reported in `problems`.
    With `lock=True` the product rows are locked for the rest of the transaction.
    """
    qty_by_product: dict[int, int] = {}
    for item in items:
        qty_by_product[int(item["product"])] = qty_by_product.get(int(item["product"]), 0) + int(item["qty"])

    products = Product.objects.filter(pk__in=qty_by_product, is_active=True)
    if lock:
        products = products.select_for_update()
    products_by_id = {product.pk: product for product in products}

    quote = Quote(lines=[])
    for product_id, qty in qty_by_product.items():
        product = products_by_id.get(product_id)
        if product is None:
            quote.problems.append(f"Product {product_id} is no longer available.")
            continue
        if qty > product.stock:
            quote.problems.append(f"Only {product.stock} × {product.title} left in stock.")
        quote.lines.append(QuoteLine(product=product, qty=qty))

    quote.subtotal = money(sum((line.line_total for line in quote.lines), Decimal("0")))
    if discount_code:
        quote.discount = find_discount(discount_code, quote.subtotal)
        quote.discount_amount = money(quote.subtotal * quote.discount.percent / 100)
    quote.shipping_fee = shipping_fee_for(quote.subtotal) if quote.lines else Decimal("0.00")
    quote.total = money(quote.subtotal - quote.discount_amount + quote.shipping_fee)
    return quote
