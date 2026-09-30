---
status: active
active: [../infrastructure/spec.md, ../field-wiring/spec.md]
activity: design
next: present checkbox and picker package definitions for execution selection; continue input/select external verification and infrastructure under their existing authority
waiting_on: field package execution selection; input/select WebKit and packaging type evidence
profile: current owner-selected Codex session; infrastructure implementation reserved for a separate executor
---

# Buntpapier beta

Bring the form controls and overlays to `3.0.0-beta.1`, with shared API contracts and evidence for the accessibility target. Beta owns milestone scope, boundaries between subjects, dependencies and combined release acceptance. Subject quests own their detailed contracts; delivery briefs preserve component requirements until a bounded outcome is selected.

## Authority and current state

On 2026-09-18 the owner deferred style observation and validation/forms, then requested focused subquests. On 2026-09-19 the owner requested the [readiness review](research/2026-09-19-readiness-review.md), directed that infrastructure have its own quest without implementation by the reviewing agent, and accepted the review recommendations: “we can integrate the datepicker-plan.md, then delete it. the todos in the readme can just go. agree on your other points, go”. This authorizes the documentation consolidation and the ownership, sequencing and working format below. It does not resume the deferred subjects or start infrastructure implementation.

On 2026-09-20 the owner selected [infrastructure design and planning](../infrastructure/spec.md), chose a minimal first delivery and confirmed that beta keeps reactivity-transform. The owner subsequently approved the delivery proposal with existing behavior tests migrated to owned fixtures and docs smoke clearly separated, and approved test-policy. Infrastructure records the amended M1 and the [accepted testing policy](../../design/testing.md); implementation remains unstarted with no executor assigned. The subsequent field-wiring selection is recorded below. [API decisions](../../design/api-design.md) are adopted; acceptance of the completed API work record remains separate from those decisions. Picker baseline repairs and earlier two-engine checks are reported in [their work record](work/date-pickers.md). Infrastructure subsequently verified the owner-supplied green three-engine CI baseline at `e1e0d4b`; this is historical evidence, not beta acceptance. [Documentation work](work/documentation.md) records the consolidation and its checks.

On 2026-09-20 the owner selected field-wiring design and deferred field abstractions to the form feature with validation. [Existing input contracts](../field-wiring/spec.md) now scopes current control behavior; [forms](../validation-forms/spec.md#deferred-field-abstractions) owns the wrapper and form attachment together. Detailed input decisions remain proposals. This does not resume forms or authorize product implementation.

On 2026-09-20 the owner accepted the existing-input scope, confirmed that the floating-label appearance stays, and selected attribute/event routing as the next design step. [Future label placement](../label-placement/spec.md) is a separate deferred quest for optional additional placements; it adds no beta gate. The owner subsequently accepted the routing proposal with “agree on your routing proposal”. [Input routing](../../design/input-routing.md) records the contract; implementation and verification remain outstanding. Content slots and external feedback were selected as the next design topic.

On 2026-09-20 the owner accepted text props with matching-slot precedence, deferred Markdown support, and deferred new standalone external-feedback props to the [single-input use case](../validation-forms/spec.md#standalone-input-feedback). The future [compact-feedback quest](../compact-feedback/spec.md) owns feedback hidden by intentional compact hint suppression. It is not active input-contract implementation; accessible feedback remains required before claiming compact validation delivery.

On 2026-09-20 the owner accepted readonly inspection and clearing defaults, reopened disabled discoverability/focus and the need for distinct readonly/disabled states, and narrowed form support to SPA submit handlers reading reactive data. Native request serialization and native resets are excluded. Popup/embedded switching after mount is unspecified, superseding its earlier transition-preservation gate; other live CSS behavior remains required. [Input contracts](../field-wiring/spec.md) records the choices and [selection](../selection/spec.md#enter-and-spa-submission) owns the Enter proposal.

On 2026-09-20 the owner tentatively approved disabled discoverability with blocked activation and control-specific focus handling, select-only Enter opening/accepting without submission, and the proposed input/select-first delivery sequence. These are provisional design directions; implementation is not authorized. Clear-token names and slot coverage are the next design details. [Input contracts](../field-wiring/spec.md) and [selection](../selection/spec.md#enter-and-spa-submission) retain verification and final-acceptance conditions.

On 2026-09-20 the owner accepted the [clear-control and content-slot contract](../field-wiring/spec.md#accepted-clear-control-and-content-slot-api), excluding floating-label slots. Input/select/picker labels are text-only; hint slots, checkbox label-slot precedence and the picker CSS token are accepted. Component implementation remains outstanding.

On 2026-09-20 the owner requested the [input/select work package](../field-wiring/work/input-select-contracts.md). Its definition covers the accepted contracts, minimal tooltip integration and verification dependencies. The owner then selected implementation and a parallel Sol high/Astra medium comparison. Independent Astra review favored Astra’s implementation, now retained with 80 Chromium/Firefox component cases and 12 docs-smoke cases passing. WebKit, manual AT and packaging type evidence remain open; owner acceptance has not been supplied. On 2026-09-21 the owner reopened tooltip compatibility; the [regression investigation](../field-wiring/work/tooltip-regressions.md) records lost motion, click-through and accidental button/link activation. The approved compatibility repair is now implemented and independently reviewed; five broader field/SSR failures reproduced against its before-state remain for diagnosis alongside the outstanding acceptance evidence.

On 2026-09-23 the owner [tentatively accepted](../field-wiring/spec.md#owner-decisions-2026-09-23) the input/select and picker packages, renamed the routing term “entry” to “control”, aligned the inline calendar's compact hint with input and chose to start checkbox separately. The five field/SSR failures were a generated-id defect already fixed in `4fc44fd`. Final acceptance of both packages waits on WebKit CI and packaging declaration evidence.

## Shared constraints and durable outputs

On 2026-09-21 the owner deferred manual screen-reader testing for all quests until their setup is ready and requested the checkbox and picker package definitions. The [release evidence record](work/release.md#people-and-external-evidence) owns that shared deferral. [Field wiring](../field-wiring/spec.md#first-work-package) now links both defined packages; implementation awaits selection. Automated checks and other evidence collection continue, and manual verification remains explicitly unclaimed.

The owner accepted [disabled focus behavior](../field-wiring/spec.md#accepted-disabled-focus-behavior) on 2026-09-20. A Firefox native-element probe confirmed guarded checkbox activation but found that ARIA-disabled required checkboxes block submission. The owner subsequently accepted [native validation as unsupported](../field-wiring/spec.md#accepted-native-validation-boundary), with library-owned validation and accessible state/feedback. The [product philosophy](../../design/philosophy.md) makes a complete SPA UX/DX the product goal. Component and AT evidence remain outstanding.

- [API guide](../../design/api-guide.md) and [API decisions](../../design/api-design.md): ordinary components by default, selective primed workflows, live CSS presentation and common field vocabulary.
- [Architecture](../../design/architecture.md): native platform direction, browser floor, internal behavior boundaries and dependency rationale. Verify required subfeatures at the supported floor before retiring a bridge.
- [Accessibility acceptance](../../design/accessibility.md): component criteria and required automatic/manual evidence.
- [Bridge inventory](../../design/js-bridge-inventory.md): JavaScript responsibilities and retirement conditions. Observer replacement and public-token registration remain unresolved; `useComputedStyle` retains its call signature.
- [Picker interaction](../../design/date-picker-interaction.md): current interaction and retained design rationale. Remaining editing work belongs to its delivery brief.

Narrative public docs remain human-authored; agent work in `docs/` is limited to mechanical references and permitted evidence records. RTL delivery is outside beta scope; new styles use logical properties and avoid blocking later support. The accepted removal of Vuelidate is direct, without an adapter or compatibility period, when its replacement lands.

## Subquests

| Owner | Outcome | Boundary and dependency |
|---|---|---|
| [Infrastructure and verification](../infrastructure/spec.md) | CI baseline, reusable fixtures, ephemeral testing and retention policy, shared accessibility styles and announcement behavior | Implementation belongs to a separate executor; packaging supplies its public type/consumer contract; components supply expected behavior |
| [Overlay lifecycle](../overlay-lifecycle/spec.md) | Native transitions, focus, dismissal and overlay migration | Native transition design can proceed independently; shipping live CSS behavior requires actual observation evidence |
| [Existing input contracts](../field-wiring/spec.md) | Current control props, attributes/events, naming, readonly, content slots and SPA submission behavior | Scope, routing and text-prop/slot precedence accepted; readonly/clearing behavior accepted; disabled focus handling accepted; native validation unsupported; input/select and pickers implemented, independently reviewed and tentatively accepted on 2026-09-23, with WebKit and packaging evidence pending for final acceptance; checkbox defined; new standalone feedback props deferred |
| [Selection and naming](../selection/spec.md) | Taxonomy, identity, active/selected items and select/combobox delivery | Settle taxonomy before public signatures; consume overlay entry/exit and ordinary input contracts |
| [Initialization and strings](../app-configuration/spec.md) | Reactive locale/dictionaries, local overrides, app isolation and SSR consistency | Infrastructure owns announcement mechanics; validation keys follow forms' error model |
| [Packaging and declarations](../packaging/spec.md) | Exports, Vue compatibility, declarations, SSR imports and packed consumers | Begin feasibility early; extend evidence when public APIs settle; infrastructure runs the checks |
| [Primed-view attachment](../primed-components/spec.md) | Stable view identity, mounts, forwarding, lifetime and cancellation | An actual in-scope workflow is required before its factory API; every published primed surface must pass this contract |
| [Style observer](../style-observer/spec.md) | Observation/registration choice and browser integration evidence | Deferred; affects live presentation delivery, not unrelated contract design |
| [Validation and forms](../validation-forms/spec.md) | Logical field state, validation/schema behavior, form authoring and field attachment | Deferred; its semantics precede finalizing form integration, not ordinary field naming or overlay design |

The [compact-feedback quest](../compact-feedback/spec.md) is deferred and retains the unresolved compact-validation accessibility gap. It does not block unrelated input design.

The separate [future label placement quest](../label-placement/spec.md) owns optional additional placements. It is deferred future work, outside the beta delivery gates; the current floating-label appearance is retained.

The [Sass linting quest](../sass-lint/spec.md) records why no style linter covers the indented Sass sources yet and when to look again. It is deferred and adds no beta gate.

## Milestone scope and delivery ownership

The inventory commits to outcomes; unresolved component names, signatures and presentation policies stay with their owners. All entries inherit the shared acceptance criteria. Missing verification cannot be turned into a follow-up without an explicit scope decision.

| Outcome | Delivery owner | Scope still to settle locally |
|---|---|---|
| Button, input, checkbox, circular progress, ripple and scrollbars | [Existing controls brief](work/components.md) | Component-specific accessibility fixes and bridge retirement where justified |
| Field wrapper and custom/group control attachment | [Validation/forms](../validation-forms/spec.md#deferred-field-abstractions) | Deferred with the form feature; establish wrapper usefulness and adapter shape together |
| Form workflow and validation replacement | [Validation/forms](../validation-forms/spec.md) | Returned form view versus separate `bunt-form`, schema/definition and template API |
| Single-date and date-range pickers | [Date-input delivery](work/date-inputs.md) | Locale editing, range drafts and responsive presentation, coordinated with shared contracts |
| Select and editable/free-text selection | [Selection](../selection/spec.md#delivery-brief) | Select/combobox names and interaction split; multi-select remains a beta scope question |
| Tooltip with directive sugar, dialog and popover | [Overlays](../overlay-lifecycle/spec.md#delivery-brief) | Native positioning/migration and component-specific lifecycle policies |
| Textarea, number input, radio/group, checkbox group, switch and slider | [New control briefs](work/components.md) | Textarea surface, number parsing/AT model and slider thumb count |
| Menu/items and toast workflow | [Remaining overlay briefs](work/components.md) | Menu interaction and toast timing/actions using the shared overlay and announcer contracts |
| English built-in strings and a complete German dictionary | [Initialization](../app-configuration/spec.md) | Formatting/translation precedence and validation keys |
| Published JS, CSS and useful declarations | [Packaging](../packaging/spec.md) | Consumer imports, compatibility and SSR contract |
| Integrated examples, documentation and beta artifact | [Release evidence](work/release.md) | Named human authors/testers and final scope reconciliation |

Recipes cover search with clearing, password reveal in input, button groups, split buttons, cards, skip links, empty states, description lists and icon usage. These do not create extra component commitments. Navigation, data display, additional pickers and other future candidates live in [TODOs](../../TODOs.md#later-phase-candidates). Charts, rich text, carousels, virtualized data grids, schedulers, maps, drag-and-drop frameworks, speed dials and mega menus are outside this milestone.

## Dependencies and order of work

A prerequisite for shipping an outcome does not automatically block its design. Select and verify bounded outcomes rather than waiting for every contract to finish.

```mermaid
flowchart TD
  I[Infrastructure baseline and fixtures] --> F[Verified ordinary field delivery]
  FC[Existing input contracts] --> F
  I --> O[Verified overlay components]
  OC[Overlay lifecycle contract] --> O
  OC --> S[Select and combobox delivery]
  SC[Selection taxonomy and semantics] --> S
  FC --> S
  V[Forms semantics: deferred] --> A[Form attachment and validation delivery]
  FC --> A
  B[Observation evidence: deferred] --> L[Live CSS presentation delivery]
  OC --> L
  C[App configuration and strings] --> T[Translated consumer delivery]
  P[Package and typing feasibility] --> PC[Packed public-API evidence]
  F --> R[Combined release evidence]
  O --> R
  S --> R
  A --> R
  L --> R
  T --> R
  PC --> R
  R --> BA[Owner acceptance and beta artifact]
```

These are outcome dependencies, not a requirement to complete unrelated branches before starting a design. Before implementing a selected outcome, record its starting evidence and applicable checks. Component delivery consumes only the shared foundations and package/type checks it needs; infrastructure setup is not gated on its own completion. A full green CI baseline remains release evidence. Native overlay probes may inject resolved policy values while observation is deferred, but their result cannot stand in for stylesheet-driven update evidence.

1. Use the verified CI baseline and assign the approved minimal infrastructure delivery, including fixture migration and separate docs smoke; begin packaging feasibility independently. Keep reactivity-transform and verify that dependent type tooling supports it.
2. Design independent app configuration, ordinary input, overlay and selection contracts. The owner selected existing input contracts on 2026-09-20; coordinate popup inspection and focus choices with overlays.
3. Prove one representative control through its required contracts, typing, CSS behavior and early manual AT checks. Use that evidence before expanding the component families.
4. Resume deferred observation or forms when their consumers require them. Do not ship live presentation or form integration with those criteria unresolved.
5. Deliver the remaining families, verify their combined behavior, and close the [release evidence](work/release.md). Packaging gains consumer cases throughout delivery.

The earlier requirement to ship declarations in the next alpha remains a packaging deliverable; it is not an exit condition for unrelated design work. No alpha or beta publication is authorized by this plan.

## Parent decisions and open questions

On 2026-09-20 the owner decided “for beta: reactivity-transform: keep, definitely” in the infrastructure design request. Keep `$ref`/`$computed` and the existing transform for beta; new composables and package/source/Pug tooling must support them. No migration is planned. This closes the policy gate, while packaging still owns proving its type-check approach.

| Shortname | Type | Question / current direction | Gate |
|---|---|---|---|
| multiselect-scope | decide | Include multi-select in beta? Recommendation remains later; no scope decision yet. | After selection taxonomy, before final component scope |
| primed-workflow | decide | Which beta workflow proves attachment and typing? Form workflow is a candidate; loader/editor are not extra beta products. | Before publishing a primed API; explicitly narrow scope if beta will ship none |
| native-select | research, decide | Add an optional customizable native select or wait for the supported browser target? | Revisit when support at that target is verified |
| picker-scope | decide | Which remaining locale/range/mobile editing outcomes must ship in beta? | [Date-input delivery](work/date-inputs.md) prepares the cases before final scope |
| manual-at-and-docs | unblock | Name manual testers, machines and human narrative authors. | [Release record](work/release.md#people-and-external-evidence) tracks assignments and missing evidence |

Forms authoring, overlay tokens, number input and textarea details are local decisions in the linked scopes. Adoption of the API direction is distinct from acceptance of a completed work item, and neither supplies missing implementation or release evidence.

## Working format

Start each topic with a concrete consumer scenario and the next decision it exposes. Separate accepted constraints from source observations and proposals. Compare credible options, recommend one with its strongest drawback, and name what the choice unblocks. When evidence is missing, define the smallest probe and its stopping point.

Keep the chosen contract and alternatives in one owning spec. Add tasks only for the selected bounded outcome, then implement and verify its criteria and shared scenarios. Obtain outcome acceptance and promote reusable contracts to `design/`. Routine settled work can use a short brief; a component or composable does not automatically need a new quest.

Beta keeps scope, shared constraints and dependencies. Subject quests hold local decisions and continuation state; their work records hold selected bounded delivery; research/prototypes hold dated evidence; `design/` holds lasting accepted guidance; `docs/` holds public material under its authorship rules. `TODOs.md` is the backlog outside quest scope.

## Release acceptance

[The release record](work/release.md) is the single component/evidence matrix. It tracks automated and manual checks, mechanical references and human narrative docs, packed consumers, migration notes and integrated scenarios. Record source revisions and browser/AT versions; evidence becomes stale when relevant behavior changes.

Beta requires the agreed inventory to satisfy accessibility acceptance, the settings/async-save and searchable-list/edit-dialog examples to pass their keyboard and AT scenarios, and the actual release artifact to pass package checks. Resolve pending scope choices and unavailable manual evidence before claiming completion. The owner accepts the combined result; tagging and publication remain separately authorized release actions.
