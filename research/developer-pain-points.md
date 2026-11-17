# Developer pain points

Source basis: the starter-kit and admin-panel landscape reviewed in [competitor-analysis](competitor-analysis.md) [S8-S11] and the author's experience [J]. No survey data was collected; ranking is qualitative.

| # | Pain point | Evidence | Response in this template |
|---|---|---|---|
| 1 | Starter kits stop at login; RBAC, audit and settings get rebuilt per project | Official kits cover auth and settings only [S8] | Core RBAC, audit, settings, notifications included and tested |
| 2 | Admin packages lock the UI to their component model | Admin panels bring their own UI layer [S9] | Plain React components + tokens in repo |
| 3 | Permission drift: new features forget to register permissions | [J] | `PermissionRegistry` + module provider; `authorization:sync`; denied-path test rule |
| 4 | N+1 queries and mass-assignment slips found in production | [J] | Strict Eloquent outside production, tests fail fast |
| 5 | Upgrades: Inertia 3 breaking changes (Axios removed, ESM-only, config restructure) [S5][S6] | Upgrade guide | Built on v3 from day one; no Axios usage |
| 6 | Inconsistent table behaviour (sorting, filtering, paging) per page | [J] | One `TableQuery` + `DataTable` with whitelist |
| 7 | Accessibility regressions | WCAG 2.2 adds testable criteria [S12] | Contrast test, jsx-a11y lint |
| 8 | Insecure example credentials committed | [J] | Seed account is env-driven, local only; demo seeder refuses production |
| 9 | Unclear module boundaries decay into a ball of mud | [J] | Architecture test enforces imports |
| 10 | Onboarding time | [J] | `module:make`, docs, static preview of the UI |
