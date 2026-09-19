# Quests

Start with [the beta quest](beta/spec.md) for the milestone, shared constraints, work ownership and current continuation state.

| Quest | State | Owns |
|---|---|---|
| [Beta](beta/spec.md) | Waiting for scope selection | Dependencies, delivery briefs and release criteria |
| [Style observer](style-observer/spec.md) | Deferred | Observation options, browser spike and registration decision |
| [Validation and forms](validation-forms/spec.md) | Deferred | Schema/definition choice, form authoring and validation behavior |
| [Overlay lifecycle](overlay-lifecycle/spec.md) | Planned | Native transitions, logical open state, focus and dismissal |
| [Field wiring](field-wiring/spec.md) | Planned | Naming, attributes, readonly behavior, feedback, form connection and outline |
| [Selection and naming](selection/spec.md) | Planned | Select/combobox taxonomy, value identity and keyboard selection |
| [Initialization and strings](app-configuration/spec.md) | Planned | Reactive app configuration, dictionaries, isolation and SSR |
| [Primed-view attachment](primed-components/spec.md) | Planned | Workflow selection, mount limits, forwarding, lifetime and cancellation |
| [Packaging and declarations](packaging/spec.md) | Planned | Exports, TypeScript declarations, consumer checks and SSR imports |

The owning spec is authoritative for status and authorization. The table is a discovery map; all product subquests are siblings under beta. Defined scopes await selection before investigation. The beta quest also owns the [API work record](beta/work/api-design.md) and [date-picker work record](beta/work/date-pickers.md).

Evergreen outputs live in [design](../design/README.md). [TODOs](../TODOs.md) remains the single backlog outside quest scope. Historical planning drafts are evidence under `beta/research/`; they neither authorize work nor mark outcomes accepted. Retire an accepted quest to `quests/archive/<name>/` only after its durable knowledge and follow-ups have homes.
