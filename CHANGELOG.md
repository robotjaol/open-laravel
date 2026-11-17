# Changelog

All notable changes are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added
- Modular monolith on Laravel 13 / Inertia 3 / React 19 / Tailwind 4.
- Authentication: sign in, optional registration, password reset, optional email verification, login history, rate limiting.
- RBAC with `spatie/laravel-permission`: default roles, permission registry, role editor and permission matrix. Locked Super Admin role.
- Immutable audit log with secret redaction, activity log page and retention command.
- Runtime application settings, in-app notifications, session list, API overview.
- Versioned REST API (`/api/v1`) with Sanctum bearer tokens and a uniform error envelope.
- Example `Projects` module and `php artisan module:make` generator.
- Design system with light, dark and system themes; WCAG contrast test.
- Static, backend-free UI preview (`npm run build:preview`) with README screenshots.
- Docker image, Compose stack, GitHub Actions (PHP, frontend, security, Docker, Pages preview, E2E).
- Research dossier, ADRs, documentation set, threat model.
