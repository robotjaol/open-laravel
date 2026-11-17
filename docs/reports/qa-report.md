# QA report

Scope: what was actually executed.

| Check | Result | Where |
|---|---|---|
| ESLint (jsx-a11y) | pass | local |
| Prettier | pass | local |
| TypeScript `tsc --noEmit` | pass | local |
| Vitest (3 files, 44 tests) | pass | local, 2026-11-18 |
| Production build and preview build | pass | local |
| Preview navigation/reload in headless Chrome | pass | local |
| `php -l` on every PHP file | pass | local |
| PHPUnit, Larastan, Pint, PostgreSQL migrate/rollback | passed on commit c682f7f (64 PHPUnit tests, PHP 8.3 and 8.4) | GitHub Actions |
| Playwright E2E | not run yet | CI (PR/manual) |
| Manual accessibility audit | not performed | - |
