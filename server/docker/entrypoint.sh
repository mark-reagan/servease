#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

: "${PORT:=8080}"
export PORT

# musl's DNS resolver (used by Alpine) gives up faster than glibc; retry more before failing external lookups (e.g. Aiven MySQL).
export RES_OPTIONS="attempts:5 timeout:2"

envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
fi

if [ -z "${APP_KEY:-}" ] && ! grep -q '^APP_KEY=base64' .env 2>/dev/null; then
    php artisan key:generate --force
fi

php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
fi

if [ -L public/storage ]; then
    rm public/storage
fi
php artisan storage:link || true

chown -R www-data:www-data storage bootstrap/cache

exec "$@"
