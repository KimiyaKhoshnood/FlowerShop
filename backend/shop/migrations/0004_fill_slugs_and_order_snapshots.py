from decimal import Decimal

from django.db import migrations, models
from django.utils.text import slugify


def unique_slug(base, taken):
    slug = base or "item"
    counter = 2
    while slug in taken:
        slug = f"{base}-{counter}"
        counter += 1
    taken.add(slug)
    return slug


def fill_slugs_and_snapshots(apps, schema_editor):
    Category = apps.get_model('shop', 'Category')
    Product = apps.get_model('shop', 'Product')
    Order = apps.get_model('shop', 'Order')
    OrderItem = apps.get_model('shop', 'OrderItem')

    for model, source in ((Category, 'name'), (Product, 'title')):
        taken = set()
        for obj in model.objects.order_by('pk'):
            obj.slug = unique_slug(slugify(getattr(obj, source))[:110], taken)
            obj.save(update_fields=['slug'])

    # Older orders only knew product ids; copy today's titles and prices onto them.
    for item in OrderItem.objects.select_related('product'):
        if item.product_id:
            item.product_title = item.product.title
            item.product_image = item.product.image
            item.unit_price = item.product.price
            item.save(update_fields=['product_title', 'product_image', 'unit_price'])

    for order in Order.objects.select_related('discount'):
        subtotal = sum((item.unit_price * item.qty for item in OrderItem.objects.filter(order=order)), Decimal('0'))
        percent = order.discount.percent if order.discount_id else 0
        discount_amount = (subtotal * percent / 100).quantize(Decimal('0.01'))
        order.subtotal = subtotal
        order.discount_percent = percent
        order.discount_amount = discount_amount
        order.total = subtotal - discount_amount
        order.status = 'paid'
        order.save(update_fields=['subtotal', 'discount_percent', 'discount_amount', 'total', 'status'])


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0003_catalogue_reviews_and_order_totals'),
    ]

    operations = [
        migrations.RunPython(fill_slugs_and_snapshots, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='category',
            name='slug',
            field=models.SlugField(max_length=120, unique=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='slug',
            field=models.SlugField(max_length=120, unique=True),
        ),
    ]
