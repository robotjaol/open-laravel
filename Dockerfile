# syntax=docker/dockerfile:1

# ---- Frontend assets ----
FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources ./resources
COPY vite.config.ts tsconfig.json ./
COPY public ./public
RUN npm run build

# ---- PHP dependencies (production only) ----
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# ---- Runtime: nginx + php-fpm under supervisord, non-root ----
FROM php:8.4-fpm-alpine AS runtime
RUN apk add --no-cache nginx supervisor icu-dev libzip-dev oniguruma-dev postgresql-dev sqlite-dev \
    && docker-php-ext-install -j"$(nproc)" intl pdo_pgsql pdo_mysql pdo_sqlite bcmath opcache pcntl \
    && rm -rf /var/cache/apk/*

COPY docker/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

WORKDIR /var/www/html
COPY --from=vendor /app /var/www/html
COPY --from=assets /app/public/build /var/www/html/public/build
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache database \
    && chown -R www-data:www-data storage bootstrap/cache database /var/lib/nginx /var/log/nginx /run

USER www-data
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/up >/dev/null || exit 1
ENTRYPOINT ["entrypoint"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
