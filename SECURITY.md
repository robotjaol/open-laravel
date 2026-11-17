# Security policy

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's private vulnerability reporting:
**Security tab > Report a vulnerability** on this repository. Include affected version or commit, reproduction steps and impact.

Target response times (best effort, maintained by one person): acknowledgement within 5 business days, status update within 14 days.

## Supported versions

Only the latest commit on `main` and the latest tagged release receive fixes.

## Scope notes for adopters

This is a template. Before production use you are responsible for: setting `APP_KEY`, `APP_DEBUG=false`, HTTPS, strong database credentials, changing or removing the seed account, configuring trusted proxies, mail, backups and log shipping. See [docs/security.md](docs/security.md) and [docs/deployment.md](docs/deployment.md).

Dependency audits run weekly (`.github/workflows/security.yml`); they do not replace your own review.
