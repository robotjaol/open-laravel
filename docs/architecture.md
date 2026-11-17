# Architecture

## Style: modular monolith

One deployable application, divided into modules with enforced dependency direction. Rationale and alternatives: [ADR 0001](../research/adr/0001-modular-monolith.md).

```
app/
  Core/            Platform capabilities every app needs
    Authentication/  users, login history, auth controllers, API tokens
    Authorization/   permission registry, default roles, sync command
    Audit/           immutable audit log, Auditable trait, prune command
    Settings/        runtime settings, profile and settings controllers
    Notifications/   in-app notifications
  Modules/         Business features, auto-discovered
    Dashboard/ Users/ Roles/ Projects/ (example)
  Shared/          Framework-agnostic helpers (TableQuery, PaginatedData, base controller)
  Http/            Middleware and cross-cutting controllers
```

Dependency rule (tested): `Modules -> Core, Shared`; `Core -> Shared`; modules never import each other. Cross-module needs go through Core services, events, or the permission registry.

## Request flow (web)

`Browser -> nginx -> PHP-FPM -> middleware (session, CSRF, SecurityHeaders, EnsureUserIsActive, HandleInertiaRequests) -> route -> controller -> policy/permission -> service -> Eloquent -> Inertia response (props JSON) -> React page`.

Controllers stay thin: validate (FormRequest), authorize (policy), call a service when business rules exist, return an Inertia response or redirect. Business invariants (last Super Admin, self-deletion, role escalation) live in services such as `UserService`.

## Module discovery

`ModuleServiceProvider` globs `app/Modules/*` and registers `App\Modules\{Name}\{Name}ServiceProvider`. Each module provider extends `Shared\Support\ModuleServiceProvider`, which loads `Database/Migrations`, `routes/web.php` (web + auth + active) and `routes/api.php` (api + Sanctum + active, prefix `api/v1`). Disable a module with `DISABLED_MODULES=Projects`.

## Data

Relational, migration-driven; SQLite by default for development and tests, PostgreSQL recommended for production (CI migrates on PostgreSQL 17). Eloquent runs in strict mode outside production (no lazy loading, no silently discarded attributes) so N+1 queries and mass-assignment slips fail in tests.

## Frontend

Inertia 3 with React 19 and TypeScript. Pages in `resources/js/pages`, layouts in `resources/js/layouts` (app, auth, settings). Server-driven tables: the URL query (`search`, `sort`, `direction`, `per_page`, `filter[...]`) is the single source of state and the server whitelists sortable and filterable columns (`TableQuery`).

## Cross-cutting

| Concern | Mechanism |
|---|---|
| Authorization | Spatie permissions + policies; `Gate::before` grants Super Admin only for argument-less ability checks, so policies still guard model-specific rules |
| Audit | `Auditable` trait (created/updated/deleted) plus explicit `AuditLogger::log()` for domain events; secrets redacted by key |
| Settings | `SettingsService`: DB values over `config/settings.php` defaults, cached |
| Errors | Web: Inertia error pages for 403/404/419/429/500/503. API: JSON envelope `{message, code, errors?}` |
| Security headers | `SecurityHeaders` middleware; nonce-based CSP in production |

## Known constraints

See [implementation status](reports/implementation-status.md).
