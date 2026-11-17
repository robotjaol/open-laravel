# ADR 0001: Modular monolith

- Status: accepted (2026-11-18)
- Context: a reusable template must be easy to deploy and to extend. Microservices add operational cost; an unstructured monolith decays.
- Decision: one deployable app divided into `Core`, `Modules`, `Shared` with a one-way dependency rule enforced by `tests/Architecture/ModuleBoundaryTest.php`.
- Alternatives: microservices (rejected: operational overhead for a template); flat Laravel layout (rejected: no boundaries).
- Consequences: simple deploy; modules can be extracted later by replacing in-process calls with APIs; boundary test must stay green.
