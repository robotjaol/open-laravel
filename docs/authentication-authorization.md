# Authentication and authorization

## Authentication
| Feature | Behaviour |
|---|---|
| Sign in | Email + password. Only `active` accounts can authenticate; failure message is identical for unknown email, wrong password and inactive account. |
| Rate limiting | 5 failed attempts per email+IP per 60 s (`config/security.php`), plus 10 requests/min/IP on auth endpoints. Lockouts are recorded. |
| Session | Regenerated on login, invalidated on logout; database driver, encrypted. |
| Registration | Off by default (`REGISTRATION_ENABLED` or Settings page). New accounts get the least-privileged `Viewer` role. |
| Password reset | Response is identical whether or not the email exists. Tokens come from Laravel's broker. |
| Email verification | Optional (`REQUIRE_EMAIL_VERIFICATION=true`). |
| Password policy | Minimum 12 characters, mixed case, number, symbol; breached-password check (HIBP, k-anonymity) enabled in production. |
| Deactivated users | `EnsureUserIsActive` ends the session or rejects the token on the next request. |
| API | `POST /api/v1/auth/token` returns a Sanctum bearer token (expires after `SANCTUM_TOKEN_EXPIRATION` minutes, default 480). |

## Authorization
- Permissions are strings (`users.update`) registered by modules in `PermissionRegistry`.
- Roles group permissions. Defaults: **Super Admin** (all, immutable), **Admin** (all at creation), **Manager** (`projects.*`, `users.view`), **Viewer** (`projects.view`).
- Policies add object-level rules, e.g. nobody deletes themselves; only a Super Admin can edit or grant Super Admin; the last active Super Admin cannot be deactivated or deleted.
- `Gate::before` returns true for Super Admin only when the check has no model argument, so policy rules still apply to everyone.
- Frontend hides controls using the shared `auth.permissions` list. This is a convenience; the server always enforces.

## Audit
Role, permission, user, settings and project changes, plus sign-in events, are written to `audit_logs` (immutable; secrets redacted). Retention: `AUDIT_RETENTION_DAYS` (minimum 30); run `php artisan audit:prune` on a schedule.
