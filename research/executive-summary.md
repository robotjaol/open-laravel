# Executive summary

Date: 2026-11-18. Status of evidence: desk research; see [README](README.md) for limits.

## Conclusion
Build the template as a **modular monolith on Laravel 13 with Inertia 3 + React 19**, with RBAC, audit trail, settings, notifications and a versioned API in a `Core` layer, and business features as auto-discovered modules. Use first-party and widely adopted packages only (`spatie/laravel-permission`, Sanctum). [J]

## Why
1. **Stack is current and supported.** Laravel 13 shipped 2026-03-17, requires PHP 8.3, with bug fixes to Q3 2027 and security fixes to Q1 2028 [S1][S3]. Inertia 3 went stable 2026-03-26 and follows Laravel's support policy [S4]. Starting on these versions gives the longest support window.
2. **Gap in the market.** Official starter kits give authentication and settings only [S8]; admin-panel packages (Filament, Nova, Orchid, Backpack, MoonShine) are strong for CRUD but impose their own UI and conventions [S9][S10]. A neutral base with RBAC, audit, settings, API and a design system, where you own all the code, is a distinct niche. [J]
3. **Accessibility and security as defaults, not add-ons.** WCAG 2.2 AA is the current W3C standard [S12][S13]; OWASP ASVS gives a checkable security baseline [S15]. Both are encoded as tests and middleware rather than prose.

## What the research changed in the design
| Finding | Design response |
|---|---|
| Inertia 3 removes Axios and changes Blade integration [S5][S6] | Use `x-inertia` Blade components; custom HTTP client allowed (used by the static preview) |
| Vite 6 dropped, Vite 8 supported [S7] | Vite 8 + laravel-vite-plugin 3 |
| WCAG 2.5.8 minimum 24x24 px target [S12][S14] | 36 px icon buttons; contrast test in CI |
| ASVS: new session token on authentication [S17] | `session()->regenerate()` on login, tested |
| Admin packages hide the UI layer [S9] | Own the UI: React components + tokens in repo |

## Risks and unknowns
- Inertia 3 and Laravel 13 are recent; some ecosystem packages may lag. Mitigation: few dependencies. [J]
- The backend was written without the ability to install PHP dependencies in the authoring environment; correctness relies on CI. See [implementation status](../docs/reports/implementation-status.md).
