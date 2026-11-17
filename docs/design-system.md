# Design system

Tokens live in `resources/css/app.css` (Tailwind 4, `@theme inline`, OKLCH colours). Components live in `resources/js/components/ui` (primitives built on Radix) and `resources/js/components/app` (layout and patterns: DataTable, KpiCard, PageHeader, EmptyState, ConfirmDialog, StatusBadge, BarChart).

| Area | Decision |
|---|---|
| Themes | Light, dark, system. Stored in `localStorage` (`appearance`); applied before first paint to avoid flash. |
| Colour | Semantic tokens (`background`, `surface`, `primary`, `muted-foreground`, `danger`, ...). Never use raw colours in pages. |
| Type | Inter Variable; sizes from the Tailwind scale; tabular numerals for data. |
| Layout | Collapsible sidebar (persisted), mobile drawer, page header with breadcrumbs. |
| States | Every table has loading, empty (with action), filtered-empty and error states. |
| Motion | Short transitions only; `prefers-reduced-motion` honoured. |
| Destructive actions | Always a named confirmation dialog. |

Add a component: put it in `components/ui`, use tokens only, forward refs, include a visible focus ring, and add a Testing Library test when it has behaviour.
