# ADR 0003: Permissions as strings, policies for object rules

- Status: accepted
- Decision: use `spatie/laravel-permission`; modules register permissions in `PermissionRegistry`; policies enforce object-level rules (self-delete, Super Admin protection). `Gate::before` grants Super Admin only for argument-less checks so policy invariants still apply.
- Alternatives: custom RBAC schema (more code, more risk); attribute-based access control (heavier than needed).
- Consequences: default roles seed only on creation so administrator edits are never overwritten; new permissions must be granted to existing roles explicitly.
