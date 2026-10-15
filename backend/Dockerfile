FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DJANGO_DEBUG=False \
    SQLITE_PATH=/data/db.sqlite3

WORKDIR /app
COPY requirements.txt requirements-prod.txt ./
RUN pip install -r requirements-prod.txt

COPY . .
RUN python manage.py collectstatic --noinput \
    && useradd --create-home app && mkdir -p /data && chown app /data
USER app

EXPOSE 8000
# Migrate and load the demo catalogue on start, then serve with gunicorn.
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py seed_shop && gunicorn flowershop_backend.wsgi --bind 0.0.0.0:8000 --workers 3 --access-logfile -"]
