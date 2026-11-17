#!/bin/sh
set -e
cd /var/www/html

# Cache framework metadata for production. Skipped when APP_ENV is not production.
if [ "${APP_ENV}" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Opt-in: set RUN_MIGRATIONS=true for single-instance deployments. Use a release step for scaled setups.
if [ "${RUN_MIGRATIONS}" = "true" ]; then
    [ "${DB_CONNECTION}" = "sqlite" ] && touch "${DB_DATABASE:-database/database.sqlite}"
    php artisan migrate --force
    php artisan authorization:sync
fi

exec "$@"
