# Quests

Start with [the beta quest](beta/spec.md) for the milestone, shared constraints, work ownership and current continuation state.

| Quest | Owns |
|---|---|
| [Beta](beta/spec.md) | Dependencies, delivery briefs and release criteria |
| [Infrastructure and verification](infrastructure/spec.md) | CI and fixture groundwork, ephemeral testing and retention policy, shared accessibility mechanics and evidence collection |
| [Style observer](style-observer/spec.md) | Observation options, browser spike and registration decision |
| [Validation and forms](validation-forms/spec.md) | Schema/definition choice, form authoring and validation behavior |
| [Overlay lifecycle](overlay-lifecycle/spec.md) | Native transitions, logical open state, focus and dismissal |
| [Field wiring](field-wiring/spec.md) | Naming, attributes, readonly behavior, feedback, form connection and outline |
| [Selection and naming](selection/spec.md) | Select/combobox taxonomy, value identity and keyboard selection |
| [Initialization and strings](app-configuration/spec.md) | Reactive app configuration, dictionaries, isolation and SSR |
| [Primed-view attachment](primed-components/spec.md) | Workflow selection, mount limits, forwarding, lifetime and cancellation |
| [Packaging and declarations](packaging/spec.md) | Exports, TypeScript declarations, consumer checks and SSR imports |

Each owning spec is authoritative for status, authorization and the next action; this index does not duplicate those fields. The subject quests are siblings under beta. Infrastructure implementation is reserved for a separate executor.

Beta also owns [API work](beta/work/api-design.md), [picker ground truth](beta/work/date-pickers.md), [date-input delivery](beta/work/date-inputs.md), [component delivery briefs](beta/work/components.md), [release evidence](beta/work/release.md) and [documentation verification](beta/work/documentation.md).

Evergreen outputs live in [design](../design/README.md). [TODOs](../TODOs.md) remains the single backlog outside quest scope. Historical planning drafts are evidence under `beta/research/`; they neither authorize work nor mark outcomes accepted. Retire an accepted quest to `quests/archive/<name>/` only after its durable knowledge and follow-ups have homes.
