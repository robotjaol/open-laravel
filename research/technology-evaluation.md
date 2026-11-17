# Technology evaluation

| Decision | Chosen | Alternatives considered | Reason | Evidence |
|---|---|---|---|---|
| Framework | Laravel 13, PHP 8.3+ | Laravel 12 (supported to Feb 2027 security) | Newest major, longest window: bug fixes Q3 2027, security Q1 2028 | [S1][S3] |
| Frontend bridge | Inertia 3 | Livewire, separate SPA + API | Server-driven routing and auth without a second API surface; v3 stable 2026-03-26 | [S4][S5] |
| UI library | React 19 + TypeScript | Vue, Svelte | Largest component ecosystem; Inertia 3 dropped React 18 [S22] | [S22] |
| Styling | Tailwind 4 with CSS tokens | CSS modules, component kits | Token-driven themes (light/dark/system), no runtime CSS | [J] |
| Primitives | Radix UI | Headless UI, Ark | Accessible focus management for dialogs/menus | [J] |
| Bundler | Vite 8 | Vite 6 | Inertia 3 supports Vite 8 and dropped Vite 6 | [S7] |
| Database | SQLite dev/test, PostgreSQL production | MySQL | Zero-setup dev; CI verifies migrate/rollback on PostgreSQL 17 | [J] |
| API auth | Sanctum bearer tokens | Passport (OAuth2), JWT | First-party, lightweight; Passport only when third-party OAuth clients are needed | [J] |
| Tests | PHPUnit 12, Vitest, Playwright | Pest | PHPUnit is the framework default; Pest is a reasonable alternative | [J] |
