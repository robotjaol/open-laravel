# Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Vite manifest not found` | Run `npm run build` (or `npm run dev`). |
| Blank page after deploy | Old cached views/config: `php artisan optimize:clear`. |
| `LazyLoadingViolationException` | Eager-load relations (`with(...)`) - strict mode is on outside production. |
| `MassAssignmentException` / discarded attribute | Add the column to `$fillable` or fix the attribute name. |
| New permission not visible to Admin | Default roles only seed on creation; grant in `/permissions`. |
| 419 after long idle | Session expired; the app redirects back with a message. |
| Cannot sign in as seed admin | Seeder only creates the account if no Super Admin exists; check `SEED_ADMIN_*` was set when seeding. |
| Behind a proxy, wrong scheme/IP | Set `TRUSTED_PROXIES`. |
| Static preview shows a blank page | Serve it over HTTP (not `file://`) and keep the `?p=` query. |
