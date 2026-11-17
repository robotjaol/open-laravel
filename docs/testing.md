# Testing

| Layer | Tool | Location | Command |
|---|---|---|---|
| Unit | PHPUnit | `tests/Unit` | `vendor/bin/phpunit --testsuite Unit` |
| Feature (HTTP, auth, RBAC, API) | PHPUnit | `tests/Feature` | `--testsuite Feature` |
| Integration (DB, seeding, sync) | PHPUnit | `tests/Integration` | `--testsuite Integration` |
| Architecture (module boundaries) | PHPUnit | `tests/Architecture` | `--testsuite Architecture` |
| Frontend unit/component | Vitest + Testing Library | `tests/js` | `npm test` |
| Accessibility (contrast) | Vitest | `tests/js/contrast.test.ts` | `npm test` |
| End to end | Playwright | `tests/Browser` | `npm run test:e2e` (needs PHP, built assets, seeded DB) |
| Static analysis | Larastan level 5, ESLint, tsc | CI | `vendor/bin/phpstan analyse`, `npm run check` |
| Style | Pint, Prettier | CI | `vendor/bin/pint --test` |

Tests use in-memory SQLite, array cache/session and `Hash` rounds 4. Authorization is synced in `TestCase::setUp()`; use `userWithRole('Admin')` or `superAdmin()`.

What to test for a new feature: success path, validation failure, **denied** path for each role that must not have access, audit entry when state changes.

Coverage numbers are published by CI artifacts only; this repository does not state coverage figures that were not measured.
