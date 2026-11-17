# UI/UX benchmark

Criteria drawn from WCAG 2.2 [S12][S14] and common admin patterns [J].

| Criterion | Threshold | How this template meets it |
|---|---|---|
| Text contrast | >= 4.5:1 (WCAG 1.4.3) | Token pairs asserted in `tests/js/contrast.test.ts` (both themes) |
| UI component contrast | >= 3:1 (1.4.11) | Border and focus tokens asserted |
| Target size | >= 24x24 CSS px (2.5.8) [S12][S14] | Icon buttons 36 px |
| Keyboard operability | All functions | Radix dialogs/menus, visible focus ring |
| Consistent navigation and help | 3.2.3/3.2.6 | Single sidebar; same layout on all admin pages |
| Pattern coverage | list, detail/form, dashboard, settings, error | 14 required pages implemented; see README screenshots |

Not benchmarked: competitor UIs were not captured or scored in this session; the table above is a requirements checklist, not a comparative score.
