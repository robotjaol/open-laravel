# Contributing

## Setup

```bash
composer install && npm install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate --seed
composer dev      # or: php artisan serve + npm run dev
```

Requirements: PHP 8.3+, Composer 2, Node 22+.

## Before opening a pull request

```bash
vendor/bin/pint            # PHP style (CI runs --test)
vendor/bin/phpstan analyse # static analysis
vendor/bin/phpunit         # PHP tests
npm run check              # eslint, prettier, tsc, vitest
```

## Rules

- Keep the dependency direction: `Modules` may use `Core` and `Shared`; `Core` and `Shared` never import `Modules`; modules never import each other. `tests/Architecture/ModuleBoundaryTest.php` enforces this.
- New behaviour needs a test. Authorization changes need a test for the denied case.
- Every state-changing admin action must be authorized by a policy or permission check and leave an audit entry.
- Do not commit secrets. `.env` is git-ignored.
- UI: use the components in `resources/js/components/ui`, tokens from `resources/css/app.css`, and keep keyboard access and contrast intact (`npm run test` runs the contrast test).
- Conventional commit messages are appreciated (`feat:`, `fix:`, `docs:`).

## Adding a module

```bash
php artisan module:make Invoices
```

See [docs/module-guide.md](docs/module-guide.md).
