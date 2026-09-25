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

# Retry instead of dying on a transient DNS/connection blip to the DB host at boot.
wait_for_database() {
    local host="${DB_HOST:-}"
    local port="${DB_PORT:-3306}"
    [ -z "$host" ] && return 0

    local attempt=0
    until timeout 2 bash -c "echo > /dev/tcp/${host}/${port}" 2>/dev/null; do
        attempt=$((attempt + 1))
        if [ "$attempt" -ge 30 ]; then
            echo "Database ${host}:${port} still unreachable after ${attempt} attempts; continuing anyway."
            break
        fi
        echo "Waiting for database ${host}:${port} to become reachable (attempt ${attempt})..."
        sleep 2
    done
}

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    wait_for_database
    php artisan migrate --force
fi

if [ -L public/storage ]; then
    rm public/storage
fi
php artisan storage:link || true

chown -R www-data:www-data storage bootstrap/cache

exec "$@"
