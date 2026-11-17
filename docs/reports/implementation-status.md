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
| Backend features (auth, RBAC, audit, settings, notifications, API, modules, seeders) | PHPUnit: 64 tests passed on PHP 8.3 and 8.4 in GitHub Actions (run on commit c682f7f) |
| Docker, Compose, workflows, docs, research, ADRs, threat model, OpenAPI | Files present; workflows run in CI |

## Partial
- Backend verification ran only in CI, not locally (PHP dependencies could not be installed in the build sandbox: package registry blocked by network policy).
- GitHub Pages must be enabled by the repository owner (Settings > Pages > Source: GitHub Actions) before the live preview URL works.
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
Commit c682f7f, workflow results (GitHub Actions):

| Workflow / job | Result |
| --- | --- |
| PHP: tests (PHP 8.3) | success, 64 tests |
| PHP: tests (PHP 8.4) | success, 64 tests |
| PHP: migrate and rollback on PostgreSQL 17 | success |
| PHP: Pint (style) and Larastan level 5 | success |
| Frontend: eslint, prettier, tsc, vitest | success |
| Docker: image build and smoke test | success |
| Security: dependency audit | success |
| E2E (Playwright) | not run; triggers on pull requests and manually |
| Deploy preview | fails until GitHub Pages is enabled |

A coverage percentage is not stated: it is published only as a CI artifact and was not read.
