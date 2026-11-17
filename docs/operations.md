# Operations

- **Logs**: stack channel to `storage/logs` (stderr in Docker). Request-level errors never include stack traces for API clients when `APP_DEBUG=false`.
- **Audit**: `audit_logs` table, viewable at `/activity` (permission `audit.view`). Prune with `php artisan audit:prune`.
- **Health**: `GET /up` (framework health route) for load balancers.
- **Queue**: database driver by default; run `queue:work` (included in the Docker image).
- **Backups**: not provided by the template. Back up the database and `storage/app`.
- **Authorization drift**: after adding modules, review roles in `/permissions`; `php artisan authorization:sync` creates missing permissions and default roles but never edits existing roles.
- **Monitoring to add**: error tracker, uptime check on `/up`, alert on `failed` sign-in rate (visible on the dashboard).
