# Competitor and alternative analysis

Date: 2026-11-18. Scope: things a team might use instead of this template to start a Laravel admin-style application. Evidence level per row: **S** = sourced this session, **K** = author's general knowledge, not re-verified (treat as to-check). No pricing or version numbers are asserted unless sourced.

| # | Alternative | Type | Strength | Limitation relevant to this template | Evidence |
|---|---|---|---|---|---|
| 1 | Laravel official starter kits (React/Vue/Livewire) | Starter | Official, maintained; auth + settings; community kits installable with `--using` [S8] | No RBAC, audit, API versioning or admin patterns out of the box | S |
| 2 | Laravel Breeze / Jetstream (legacy) | Starter | Breeze minimal; Jetstream adds 2FA, teams, API tokens [S19] | Replaced by new kits in official guidance [S8]; Jetstream UI is Vue/Livewire only | S |
| 3 | Filament | Admin panel | Fast CRUD, large plugin ecosystem; described as the most popular [S10] | Livewire/Filament conventions; UI customization is within Filament | S (vendor lists) |
| 4 | Laravel Nova | Admin panel | Polished, first-party, "boring in a good way" [S9] | Paid licence [S10] | S (vendor lists) |
| 5 | Backpack for Laravel | Admin panel | Mature CRUD; core free [S10] | Vendor-authored comparisons; add-ons separate | S |
| 6 | Orchid | Admin platform | Code-defined "screens", permissions and filters in PHP [S10] | Different mental model from SPA-style pages | S |
| 7 | MoonShine | Admin panel | Lightweight, open source [S10] | Smaller ecosystem (K) | S/K |
| 8 | LaravelDaily starter kit (Laravel + Filament) | Community kit | Prebuilt Filament admin with auth and example resources [S11] | Inherits Filament constraints | S |
| 9 | SaaSykit | SaaS kit | Admin on Filament, subscriptions dashboard [S20] | Billing/SaaS focus, not neutral | S (vendor blog) |
| 10 | Wave | SaaS kit | Commercial-grade SaaS starter with dashboards [S21] | SaaS/billing focus | S (listing only) |
| 11 | Voyager | Admin/CMS | Listed among admin packages [S9] | Not verified: maintenance activity | S (name only) / K |
| 12 | Twill / Sharp | CMS / content admin | Editorial CMS use cases [S10] | CMS rather than app admin | S (name only) |
| 13 | Build from scratch / internal boilerplate | DIY | Full control | Re-implements RBAC, audit, settings each time; inconsistent quality | J |

## Takeaways
- Nobody in the set combines: framework-neutral React UI you own + RBAC with a permission registry + immutable audit + versioned API + tests as quality gates. [J]
- Filament/Nova/Orchid win when speed to CRUD matters more than UI ownership; this template is for teams that want an SPA-like React front end with Laravel conventions. [J]
- The comparison deliberately avoids feature counts and star numbers; they were not measured here.

## Where this template is weaker (be honest)
No 2FA, no teams/tenancy, no plugin ecosystem, no visual form builder. Small community versus the established packages above.
