# ADR 0004: Immutable, redacted audit log

- Status: accepted
- Decision: `audit_logs` rows cannot be updated (model throws); sensitive keys (password, token, secret, ...) are redacted before storage; logging failures are reported but never break the user action; retention command refuses periods under 30 days.
- Alternatives: package-based activity logging (less control over redaction and immutability); external log pipeline only (no in-app visibility).
- Consequences: table growth needs pruning; "never break the request" means audit gaps are possible if storage fails (reported to the exception handler).
