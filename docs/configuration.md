# Configuration

| Variable | Default | Purpose |
|---|---|---|
| `APP_NAME`, `APP_URL`, `APP_TIMEZONE`, `APP_LOCALE` | see `.env.example` | Basics. Name/timezone/locale are also editable in Settings (DB overrides env). |
| `REGISTRATION_ENABLED` | `false` | Default for public sign-up (Settings can override) |
| `REQUIRE_EMAIL_VERIFICATION` | `false` | Require verified email for the app |
| `AUDIT_RETENTION_DAYS` | `365` | Used by `audit:prune` (minimum 30) |
| `SANCTUM_TOKEN_EXPIRATION` | `480` | API token lifetime in minutes |
| `DISABLED_MODULES` | empty | Comma list of module folders to skip |
| `SECURITY_CSP_ENABLED`, `SECURITY_HSTS` | on in production | Security headers |
| `SECURITY_CHECK_BREACHED_PASSWORDS` | on in production | HIBP lookup (needs outbound HTTPS) |
| `TRUSTED_PROXIES` | empty | Comma list or `*` when behind a proxy |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | local example | First Super Admin; only created if none exists |

Runtime-editable keys live in `config/settings.php` (`defaults`). Add a key there and expose it in `SettingsController` to make it editable.
