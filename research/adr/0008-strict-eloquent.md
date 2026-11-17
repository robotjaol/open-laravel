# ADR 0008: Strict Eloquent outside production

- Status: accepted
- Decision: `Model::shouldBeStrict(! production)` turns lazy loading, silently discarded attributes and missing attribute access into exceptions during development and tests.
- Consequences: relationships must be eager-loaded; production keeps lenient behaviour to avoid outages from latent issues.
