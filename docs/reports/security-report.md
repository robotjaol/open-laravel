# Security review (self-assessment)

Method: code review against the [threat model](../threat-model.md) and ASVS-based checklist. Independent third-party review: **not performed**. Penetration test: **not performed**.

| Area | Finding | Status |
|---|---|---|
| Authorization | Every module action calls a policy or permission check; privilege-escalation paths covered by tests | Covered (tests pass in CI) |
| Authentication | Generic errors, limiter, session regeneration | Covered (tests pass in CI) |
| Secrets | Seed credentials are local-only and env-driven; demo seeder does not run in production | OK |
| Dependencies | Weekly audit workflow | Configured |
| Open items | 2FA, session revocation UI, query timeouts, off-box log shipping | Documented in roadmap |
