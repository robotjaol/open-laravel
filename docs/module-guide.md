# Module guide

## Generate
```bash
php artisan module:make Invoices
```
Creates `app/Modules/Invoices` with a service provider, `routes/web.php` and a controller.

## Anatomy (see `app/Modules/Projects` for a complete example)
```
Invoices/
  InvoicesServiceProvider.php   registers permissions and policies
  Database/Migrations/          loaded automatically
  Enums/ Models/ Policies/ Http/{Controllers,Requests,Resources}/
  routes/web.php                web + auth + active middleware
  routes/api.php                /api/v1, Sanctum
```

## Checklist
1. **Permissions** - in the provider's `boot()` call `PermissionRegistry::register('invoices', 'Invoices', ['invoices.view' => 'View invoices', ...])`. They appear in the role editor and matrix automatically.
2. **Existing roles** - default roles are only seeded when first created. Grant the new permissions to existing roles in the UI, or run `php artisan authorization:sync` after adding a new default role pattern.
3. **Model** - add `Auditable` for automatic audit entries; exclude noisy columns with `$auditExclude`.
4. **Policy** - register in `policies()`; every controller action calls `$this->authorize(...)`.
5. **Table pages** - use `TableQuery::fromRequest($request, [...sortable], 'default_col', 'asc', [...filterable])` and `PaginatedData::make(...)`.
6. **Frontend** - add pages under `resources/js/pages/<module>`, add URLs to `resources/js/lib/routes.ts`, and a nav item (with its `permission`) in `resources/js/lib/navigation.ts`.
7. **Tests** - a feature test for the allowed path and one for the denied path; keep `ModuleBoundaryTest` green.
8. **Preview** - add sample data to `resources/js/preview/fixtures.ts` so the static preview shows the new pages.

## Rules
- Import only from `App\Core`, `App\Shared` and your own module.
- Share data with other modules via Core services or events, not direct imports.
