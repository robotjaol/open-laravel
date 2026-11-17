# Security

Baseline: [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) chapters on authentication, session management, access control and configuration, used as a checklist (not a certification). Threat model: [threat-model.md](threat-model.md).

| Control | Implementation |
|---|---|
| Passwords | Bcrypt (Laravel default), 12+ chars, mixed, symbols, HIBP check in production |
| Brute force | Per email+IP limiter, lockout events recorded |
| Enumeration | Identical login and reset responses |
| Sessions | Regenerate on login, invalidate on logout, encrypted DB sessions, `SameSite=lax` |
| CSRF | Laravel middleware; Inertia sends the token automatically |
| XSS | React escaping, no `dangerouslySetInnerHTML`; nonce-based CSP in production |
| Headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS (production), CSP (production) |
| Authorization | Permission + policy on every action; mass assignment via `$fillable`; strict Eloquent |
| Input | FormRequests, enum validation, whitelisted sort/filter columns, LIKE escaping |
| Audit | Immutable log, redaction of password/token/secret keys |
| Secrets | `.env` git-ignored; no real secrets in repo; seed credentials are local-only |
| Supply chain | `composer audit` and `npm audit` weekly in CI; Dependabot |
| Container | Multi-stage build, non-root user, no dev dependencies |

## Hardening checklist before production
1. `APP_ENV=production`, `APP_DEBUG=false`, unique `APP_KEY`.
2. HTTPS everywhere; `SESSION_SECURE_COOKIE=true`; set `TRUSTED_PROXIES`.
3. Remove or rotate `SEED_ADMIN_*`; never run the demo seeder (it refuses in production).
4. Strong DB credentials, least-privilege DB user, backups tested.
5. Configure a real mailer; set up log shipping and alerting on `failed` login spikes.
6. Schedule `php artisan audit:prune`.
7. Review CSP if you add third-party scripts.
