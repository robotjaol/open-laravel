# Deployment

## Docker
`Dockerfile` builds assets, installs production dependencies and runs nginx + PHP-FPM + a queue worker under supervisord as a non-root user on port 8080. Health endpoint: `/up`.

```bash
docker build -t my-app .
docker run -p 8080:8080 -e APP_KEY=... -e APP_ENV=production -e DB_CONNECTION=pgsql -e DB_HOST=... my-app
```
`RUN_MIGRATIONS=true` runs `migrate --force` and `authorization:sync` at start (fine for a single instance). For several instances run them once as a release step.

## Required environment (production)
`APP_KEY`, `APP_URL` (https), `DB_*`, `MAIL_*`, `TRUSTED_PROXIES` (when behind a load balancer), `SESSION_SECURE_COOKIE=true`. See [configuration.md](configuration.md).

## Without Docker
`composer install --no-dev -o && npm ci && npm run build && php artisan migrate --force && php artisan config:cache route:cache view:cache`. Serve `public/` with nginx/Apache + PHP-FPM; run `php artisan queue:work` under a supervisor; add `* * * * * php artisan schedule:run` if you schedule tasks (e.g. `audit:prune`).

## Rollback
Keep the previous image tag. Migrations include `down()`; CI verifies migrate and rollback on PostgreSQL.
