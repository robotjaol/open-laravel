# Threat model (STRIDE, lightweight)

Scope: the template as shipped. Assets: user credentials, sessions and API tokens, role/permission data, audit log, settings. Actors: anonymous visitor, authenticated low-privilege user, admin, compromised account, malicious insider.

| ID | Threat | STRIDE | Mitigation | Residual risk |
|---|---|---|---|---|
| T1 | Credential stuffing / brute force on login | S | Limiter per email+IP, global auth limiter, lockout logging, 12+ char policy, breached-password check (prod) | Distributed attacks across many IPs; add WAF / 2FA |
| T2 | Account enumeration via login or reset | I | Identical responses | Timing differences not measured |
| T3 | Session fixation / theft | S | Regenerate on login, encrypted DB sessions, `HttpOnly`, `SameSite=lax`, secure cookie in prod | XSS would still expose session use; mitigated by CSP |
| T4 | CSRF | T | Laravel CSRF middleware; Inertia token | |
| T5 | XSS | T/I | React escaping, no raw HTML sinks, nonce CSP (prod) | Third-party scripts added later |
| T6 | Privilege escalation (admin grants Super Admin; edits Super Admin) | E | Policies + `UserService` guards; locked role | Misconfigured custom roles with `roles.update`; review permission matrix |
| T7 | Removing the last Super Admin / self-lockout | D | Service invariants, tests | DB-level manual edits |
| T8 | Insecure direct object reference | E | Route-model binding + policy on each action; notifications scoped to owner | New modules must follow the rule (tested by convention only) |
| T9 | SQL injection via sort/filter/search | T | Whitelisted columns, bindings, LIKE escaping | Custom raw queries in new code |
| T10 | Audit log tampering | R | Model forbids updates; no UI to edit/delete; redaction | DB admin can still alter rows; ship logs off-box |
| T11 | Secrets in repo or logs | I | `.env` ignored; redaction; example creds local-only | Developers committing real secrets |
| T12 | Deactivated user keeps access | E | `EnsureUserIsActive` on web and API | Token valid until next request |
| T13 | Dependency vulnerabilities | T | Weekly `composer audit` / `npm audit`, Dependabot | Zero-day window |
| T14 | API token leakage | I | Expiry (default 8 h), revoke endpoint, HTTPS required in prod | No per-token abilities by default |
| T15 | Denial of service via heavy list queries | D | Page size capped to 10/25/50/100 | No query-time limits |

Not modelled: multi-tenancy, file uploads, payment flows (not in the template).
