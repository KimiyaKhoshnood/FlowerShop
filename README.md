# 🌷 Flower Shop

A small, bilingual (English / فارسی) online flower shop: a **Next.js** storefront talking to a **Django REST Framework** API.

Browse 22 hand-drawn flowers, filter them by category, fill your bag, try a discount code, pick a delivery date and check out. Signed-in users get a dashboard with their order history and profile; staff users can also manage products and categories.

> A just-for-fun side project — the payment step is a mock, no real money moves. 🌸

## ✨ Features

- **Bilingual UI** — English (LTR) and Persian (RTL) with a one-click language switch
- **Shop** — product list with category filter, product pages, "you may also like" slider
- **Bag** — persisted in `localStorage`, live totals, discount codes (`OFF5`, `OFF10`, `OFF15`), delivery date picker
- **Accounts** — register / login with JWT, editable profile
- **Dashboard** — your own orders with details; product & category management for staff
- **PWA** — installable, with an offline-friendly service worker in production builds
- **API docs** — Swagger UI and ReDoc out of the box

## 🧱 Tech stack

| Frontend | Backend |
| --- | --- |
| Next.js 15 (App Router) · React 19 · TypeScript | Django 5.2 · Django REST Framework |
| Tailwind CSS 4 · MUI 7 · Swiper · Recharts | Simple JWT · django-cors-headers · drf-yasg |
| react-hook-form · axios · next-pwa | SQLite (dev) |

## 🚀 Getting started

You need **Python 3.12+** and **Node.js 20+**.

### 1. Backend (http://127.0.0.1:8000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS / Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_shop      # demo flowers, discount codes and an admin user
python manage.py runserver
```

`seed_shop` creates a staff account **admin / admin12345** (skip it with `--no-admin`). It is safe to run more than once.

### 2. Frontend (http://localhost:3000)

```bash
cd frontend
npm install
npm run dev
```

The frontend talks to `http://127.0.0.1:8000` by default. To point it somewhere else, copy `frontend/.env.example` to `.env.local` and change `NEXT_PUBLIC_API_URL`.

## 🔌 API

Interactive docs: [Swagger UI](http://127.0.0.1:8000/swagger/) · [ReDoc](http://127.0.0.1:8000/redoc/)

| Endpoint | Methods | Who |
| --- | --- | --- |
| `/api/products/` (`?category=Roses`) | GET · POST · PATCH · DELETE | anyone reads, staff writes |
| `/api/categories/` | GET · POST · PATCH · DELETE | anyone reads, staff writes |
| `/api/discounts/?code=OFF10` | GET | signed-in users look up one code; staff manage all |
| `/api/orders/` | GET · POST | signed-in users, only their own orders |
| `/api/profile/` | GET · PATCH | signed-in user |
| `/register/` | POST | anyone |
| `/api/token/`, `/api/token/refresh/` | POST | anyone (JWT login) |

Example order:

```json
POST /api/orders/
{
  "discount": 2,
  "delivery_date": "2026-11-01",
  "items": [
    { "product": 2, "qty": 1 },
    { "product": 3, "qty": 2 }
  ]
}
```

## ⚙️ Configuration

The backend reads these environment variables (see `backend/.env.example`); the defaults are meant for local development only.

| Variable | Default |
| --- | --- |
| `DJANGO_SECRET_KEY` | an insecure dev key |
| `DJANGO_DEBUG` | `True` |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` |

## 🧪 Tests & checks

```bash
cd backend && python manage.py test
cd frontend && npm run lint && npm run typecheck
```

GitHub Actions runs all of these (plus a production build) on every push.

## 📁 Project structure

```
backend/
  flowershop_backend/   Django settings & root URLs
  shop/                 models, serializers, views, permissions, tests
    management/commands/seed_shop.py
frontend/
  src/app/[lang]/       routes (store, categories, bag, auth, dashboard)
  src/views/            page-level components
  src/components/       shared UI
  src/i18n/             en.json / fa.json dictionaries
  src/services/         API client
```

---

Made with 💐 by Kimia Khoshnood.
