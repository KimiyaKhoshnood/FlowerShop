# 🌷 Flower Shop

A bilingual (English / فارسی) online flower shop — a **Next.js 15** storefront on top of a **Django REST Framework** API.

Customers browse and filter fresh flowers, read and write reviews, fill a bag, apply discount codes and check out with a delivery date. Staff get an admin panel with sales charts, order fulfilment, catalogue and discount management.

> A portfolio project. Payments are mocked — no real money moves. 🌸

## ✨ Highlights

**Storefront**
- English (LTR) and Persian (RTL) with localized digits, dates and currency; language picked from `Accept-Language`
- Server-rendered catalogue with search, category / price / stock / sale filters, sorting and pagination — all in the URL
- Product pages with florist details (vase life, stem length, season calendar), reviews and star ratings, JSON-LD for search engines
- Bag that survives reloads and syncs across tabs; prices, discounts and shipping are always **calculated by the server**
- Checkout with address, delivery date and payment method; order confirmation and tracking timeline
- Account area: order history, cancelling orders, profile and password change

**Admin** (`/en/admin`, staff only)
- Overview with revenue, average order, a 14-day sales chart, best sellers, orders by status and low-stock alerts
- Order fulfilment with an enforced status flow: pending → paid → shipped → delivered (or cancelled, which restocks)
- Product editor (bilingual fields, pricing and sale price, stock, visibility, season months), categories and discount codes

**Under the hood**
- Order totals are snapshotted (unit prices, discount, shipping) so later price changes never rewrite history
- Stock is reserved inside a database transaction with row locks; overselling is impossible
- Discount codes with expiry, minimum order and usage limits; code checks and logins are rate-limited
- JWT auth with silent token refresh; route protection in Next.js middleware, real permissions in the API
- 35 backend tests, typed frontend (strict TypeScript, typed i18n dictionaries), CI on every push, Docker setup

## 🧱 Tech stack

| Frontend | Backend |
| --- | --- |
| Next.js 15 (App Router, Server Components) · React 19 · TypeScript | Django 5.2 · Django REST Framework |
| Tailwind CSS 4 · MUI (dialogs, drawers) · Swiper · Recharts | Simple JWT · django-cors-headers · drf-yasg (OpenAPI) |
| TanStack Query · react-hook-form · axios | SQLite (dev) · gunicorn + WhiteNoise (Docker) |

## 🚀 Getting started

### Option A — Docker (one command)

```bash
docker compose up --build
```

Shop: http://localhost:3000 · API docs: http://localhost:8000/swagger/ · Admin: `admin` / `admin12345`

### Option B — run locally

You need **Python 3.12+** and **Node.js 20+**.

**Backend** (http://127.0.0.1:8000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS / Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_shop      # catalogue, discount codes, demo orders and an admin user
python manage.py runserver
```

`seed_shop` is safe to re-run. It creates the staff account **admin / admin12345**, a few demo customers with reviews and two weeks of orders so the admin charts have data (`--no-admin`, `--no-demo` to skip).

**Frontend** (http://localhost:3000)

```bash
cd frontend
npm install
npm run dev
```

Demo discount codes: `OFF5`, `OFF10`, `OFF15` (from $30), `WELCOME20` (from $40, first 100 uses).

## 🔌 API

Interactive docs at [`/swagger/`](http://127.0.0.1:8000/swagger/) and [`/redoc/`](http://127.0.0.1:8000/redoc/).

| Endpoint | Methods | Access |
| --- | --- | --- |
| `/api/products/` · `/api/products/{slug}/` | GET · POST · PATCH · DELETE | read: anyone · write: staff |
| `/api/products/{slug}/reviews/` | GET · POST | read: anyone · write: signed in (one review per product) |
| `/api/categories/` · `/api/categories/{slug}/` | GET · POST · PATCH · DELETE | read: anyone · write: staff |
| `/api/orders/quote/` | POST | anyone — prices a bag without ordering |
| `/api/orders/` · `/api/orders/{id}/` · `…/cancel/` | GET · POST | signed in, own orders only |
| `/api/discounts/validate/` | POST | anyone (rate-limited) |
| `/api/discounts/` | CRUD | staff |
| `/api/admin/orders/` · `/api/admin/stats/` | GET · PATCH | staff |
| `/api/auth/register/` · `token/` · `token/refresh/` · `me/` · `password/` | — | accounts and JWT |

Product list filters: `q`, `category`, `min_price`, `max_price`, `in_stock=1`, `on_sale=1`, `featured=1`, `ids=1,2`, `sort=newest|popular|rating|price|-price|title`, `page`, `page_size`.

```http
POST /api/orders/
{
  "items": [{ "product": 3, "qty": 2 }],
  "discount_code": "OFF10",
  "payment_method": "card",
  "recipient_name": "Sara Ahmadi",
  "phone": "+98 912 000 0000",
  "city": "Tehran",
  "address": "Valiasr St. 12",
  "delivery_date": "2026-11-01"
}
```

## ⚙️ Configuration

See [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example). The most important ones:

| Variable | Default | |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | insecure dev key | **set this anywhere public** |
| `DJANGO_DEBUG` | `True` | |
| `DJANGO_ALLOWED_HOSTS` / `CORS_ALLOWED_ORIGINS` | localhost | |
| `DJANGO_HTTPS` | `False` | secure cookies, HSTS and redirect behind a TLS proxy |
| `SHOP_SHIPPING_FEE` / `SHOP_FREE_SHIPPING_FROM` | `5.00` / `50.00` | |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000` | API address for the browser |
| `INTERNAL_API_URL` | — | API address for the Next.js server, if different |

## 🧪 Tests & checks

```bash
cd backend && python manage.py test
cd frontend && npm run lint && npm run typecheck && npm run build
```

GitHub Actions runs all of this plus a Docker build on every push.

## 📁 Project structure

```
backend/
  flowershop_backend/     settings, root URLs
  shop/
    models.py             catalogue, reviews, discounts, orders
    pricing.py            server-side quotes, discounts, shipping
    serializers.py        validation, order creation, status rules
    views.py              API endpoints, filters, admin stats
    tests.py
    management/commands/seed_shop.py
frontend/src/
  app/[lang]/             routes: shop, bag, checkout, account, admin…
  components/             ui/, product/, checkout/, account/, admin/…
  lib/                    API client, auth/session, cart, i18n, formatting
  i18n/                   en.json / fa.json
  middleware.ts           language routing and route protection
```

---

Made with 💐 by Kimia Khoshnood.
