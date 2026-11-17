# Security research

Baselines: OWASP ASVS chapters V6 Authentication, V7 Session Management, V8 Authorization, V13 Configuration [S15]; OWASP Authentication Cheat Sheet [S16].

| Requirement area | Source | Control | Verification |
|---|---|---|---|
| New session token on authentication | [S17] | `session()->regenerate()` in `LoginController` | `LoginTest::test_user_can_sign_in_and_is_recorded` (asserts login; regeneration reviewed in code) |
| Logout invalidates session | [S16] | `invalidate()` + `regenerateToken()` | `LoginTest::test_logout_ends_the_session` |
| Brute-force resistance | [S16] | Limiter 5/min per email+IP, lockout event | `LoginTest::test_login_is_rate_limited_after_five_failures` |
| No account enumeration | [S16] | Generic failure and reset responses | `LoginTest`, `PasswordResetTest` |
| Access control on every action | [S15] | Policies + permissions | `UserManagementTest`, `RoleManagementTest`, `ApiTest` |
| Secure configuration | [S15] | Headers, CSP nonce, HSTS, debug off in prod | `CoreFeaturesTest::test_security_headers_are_present` (basic) |

Limits: ASVS is used as a checklist; no level is claimed. No penetration test was performed. See [threat model](../docs/threat-model.md).
