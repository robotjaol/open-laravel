# Accessibility

Target: **WCAG 2.2 Level AA** ([W3C: What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)).

## Built in
- Landmarks, skip link ("Skip to main content"), one `h1` per page, labelled controls (`Field` wires label, hint and error via `aria-describedby`).
- Keyboard: all actions reachable; dialogs and menus use Radix focus management; visible focus ring on every interactive element.
- Pointer: icon buttons are at least 24x24 CSS px (2.5.8 Target Size). No drag-only interactions (2.5.7).
- 2.4.11 Focus Not Obscured: the top bar is sticky (56 px), so focused elements can scroll underneath it. `html { scroll-padding-top: 4.5rem }` keeps focus targets clear of it; not verified by a manual audit.
- Authentication has no cognitive-function test; paste into password fields is allowed (3.3.8).
- Colour is never the only status signal (badges carry text).

## Automated checks (run in CI)
- `tests/js/contrast.test.ts`: computes contrast for token pairs in both themes (text >= 4.5:1, UI borders >= 3:1). 28 assertions.
- ESLint `jsx-a11y` rules.
- Testing Library queries by role/label in component tests.

## Not covered (manual work required)
Automated tools find only a subset of WCAG issues. Before claiming conformance for your product, test with a screen reader (NVDA/VoiceOver), keyboard-only, 200% zoom and reduced motion. A full manual audit of this template has **not** been performed.
