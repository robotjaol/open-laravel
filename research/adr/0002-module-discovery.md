# ADR 0002: Convention-based module discovery

- Status: accepted
- Decision: `ModuleServiceProvider` registers `App\Modules\{Name}\{Name}ServiceProvider` for every folder in `app/Modules` unless listed in `DISABLED_MODULES`. The module base class loads migrations and route files with the correct middleware.
- Alternatives: manual provider list (error-prone), third-party module packages (extra dependency).
- Consequences: adding a feature is "create a folder"; ordering between modules is not guaranteed, so modules must not depend on each other's boot order.
