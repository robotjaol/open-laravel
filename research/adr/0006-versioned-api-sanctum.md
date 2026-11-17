# ADR 0006: Versioned REST API with Sanctum tokens

- Status: accepted
- Decision: API under `/api/v1`; bearer tokens from `POST /api/v1/auth/token`, expiring after `SANCTUM_TOKEN_EXPIRATION` minutes; uniform error envelope; `EnsureUserIsActive` rejects tokens of deactivated accounts.
- Alternatives: Passport/OAuth2 (needed only for third-party clients), JWT (revocation complexity).
- Consequences: no scopes/abilities by default; add Sanctum abilities if per-token limits are required.
