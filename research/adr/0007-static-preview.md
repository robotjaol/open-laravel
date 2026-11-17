# ADR 0007: Static UI preview with a mocked HTTP client

- Status: accepted
- Context: reviewers should see the UI without PHP, a database or Docker, and the README needs screenshots that stay in sync with the code.
- Decision: `resources/js/preview.tsx` renders the real pages and layouts, installing a custom Inertia HTTP client (`http.setClient`) that answers from `resources/js/preview/fixtures.ts`. Built by `npm run build:preview` to `docs/preview` and published to GitHub Pages by CI. Screenshots are produced by `scripts/screenshots.mjs`.
- Alternatives: Storybook (extra tooling, no page-level flows), hand-made mockups (drift).
- Consequences: fixtures must be updated when page props change; the preview is a UI demo only and proves nothing about backend behaviour.
