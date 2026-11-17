# ADR 0005: Server-driven tables with whitelisted queries

- Status: accepted
- Decision: table state lives in the URL (`search`, `sort`, `direction`, `per_page`, `filter[key]`). `TableQuery` accepts only whitelisted sort and filter keys and escapes LIKE input.
- Alternatives: client-side tables (do not scale), free-form query builders (injection risk).
- Consequences: every list endpoint must declare its sortable and filterable columns.
