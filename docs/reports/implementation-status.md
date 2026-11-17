# Implementation status

Date: 2026-11-18. Updated after each CI run (see bottom).

## Verification legend
- **Executed locally**: command was run in the authoring environment and passed.
- **CI**: verified by GitHub Actions on `main` (link in the Actions tab).
- **Not verified**: written but never run.

## Completed
| Requirement | Evidence |
|---|---|
| 14 required pages (Login, Forgot password, Dashboard, Users, Roles, Permissions, Profile, Application settings, Activity logs, Notifications, API overview, 403, 404, 500) | Pages in `resources/js/pages`; rendered in the static preview; `CoreFeaturesTest::test_all_required_pages_render` (CI) |
| Light/dark/system themes | Preview screenshots; `use-appearance` hook; component tests (executed locally) |
| Frontend quality gates | `npm run check`: eslint, prettier, tsc, vitest 44 tests passed (executed locally 2026-11-18) |
| Contrast (WCAG) | `tests/js/contrast.test.ts` (executed locally) |
| Static preview + screenshots | `npm run build:preview`, `npm run preview:screenshots`; navigation and reload checked with headless Chrome (executed locally) |
| Backend features (auth, RBAC, audit, settings, notifications, API, modules, seeders) | Code present; PHPUnit suite written (~60 tests) |
| Docker, Compose, workflows, docs, research, ADRs, threat model, OpenAPI | Files present; workflows run in CI |

## Partial
- Backend test results: **pending first CI run** (PHP dependencies could not be installed locally: package registry blocked by the sandbox network policy).
- E2E: spec written; runs on pull requests and manually, not on every push.

## Not implemented
Two-factor/passkeys, social login, teams/multi-tenancy, file uploads, i18n string catalogue, session revocation, data export, websockets. See [roadmap](../roadmap.md).

## Blocked
Local execution of PHP/Composer-dependent steps (PHPUnit, Larastan, Pint, migrations). Not circumvented.

## Known limitations
- No coverage percentage is claimed; CI publishes coverage as an artifact.
- Accessibility: automated contrast and lint only; no manual screen-reader audit.
- Security: no penetration test; ASVS used as checklist, no level claimed.
- The static preview uses fixtures; it does not prove backend behaviour.
- `spatie/laravel-permission ^8` and Laravel 13 compatibility is assumed from constraints and confirmed only by CI.

## CI log
(see below, appended as runs complete)
