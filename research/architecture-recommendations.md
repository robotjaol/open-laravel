# Architecture recommendations

1. **Modular monolith** with enforced boundaries (ADR 0001). Single deploy, low operational cost; boundaries make later extraction possible. [J]
2. **Core vs Modules.** Core holds capabilities every app needs; modules hold business features and are discovered by convention (ADR 0002). [J]
3. **Permissions as registered strings** with policies for object rules; Super Admin bypass only for argument-less checks (ADR 0003). [J]
4. **Audit as a first-class, immutable store** with redaction (ADR 0004). Aligns with ASVS emphasis on logging and access control chapters [S15]. 
5. **Server-driven tables** with whitelisted sort/filter to remove injection and inconsistency (ADR 0005).
6. **Versioned API** under `/api/v1`, uniform error envelope, bearer tokens with expiry (ADR 0006).
7. **Business rules in services**, thin controllers; invariants such as "last Super Admin" live in `UserService` and are tested. [J]
8. **Strict Eloquent outside production** to surface lazy loading and mass-assignment issues in tests. [J]
9. **Static preview build** reusing real components with a mocked HTTP client keeps UI reviewable without infrastructure. [J]
