# Package evaluation

Policy: add a dependency only when it removes substantial risk or effort; prefer first-party and widely used packages. Versions are as pinned in `composer.json` and `package.json`.

| Package | Purpose | Decision | Notes |
|---|---|---|---|
| laravel/framework ^13 | Core | Adopt | [S1] |
| inertiajs/inertia-laravel ^3, @inertiajs/react ^3 | Server-driven SPA | Adopt | [S4] |
| laravel/sanctum ^4 | API tokens | Adopt | First-party |
| spatie/laravel-permission ^8 | Roles/permissions | Adopt | De facto standard; avoids a custom RBAC schema. Compatibility with Laravel 13 to be confirmed by CI |
| larastan/larastan, laravel/pint | Static analysis, style | Adopt (dev) | |
| Radix UI primitives, lucide-react, sonner | Accessible primitives, icons, toasts | Adopt | |
| class-variance-authority, tailwind-merge, clsx | Variant styling | Adopt | |
| Vitest, Testing Library, jsdom | Frontend tests | Adopt (dev) | |
| Playwright | E2E | Adopt (dev) | Runs in CI only |
| Filament / Nova | Admin panels | Reject | Different UI ownership model (see competitor analysis) |
| Axios | HTTP | Not used | Removed from Inertia 3 [S6] |
| Passport | OAuth2 server | Defer | Needed only for third-party OAuth clients |
