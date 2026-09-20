# Beta readiness and working format review

Reviewed 2026-09-19 at `31d3b3675ca81a5aef5342559f024fcc7448ce0a`, starting from a clean working tree. The owner requested a review of missed points, infrastructure groundwork, sequencing and topic organization before entering implementation. The findings below describe that reviewed state. The owner subsequently accepted the organizational recommendations; the disposition below records their application. This does not resume deferred observer/forms work or accept earlier product outcomes.

Subsequent owner direction: “for the infra work, also create a quest and don't do it yourself”. [Infrastructure and verification](../../infrastructure/spec.md) was created as a planned sibling quest. Its creation and separate execution boundary are decided; implementation is unstarted. The owner then accepted the remaining organizational recommendations, requested integration and deletion of the root picker plan, and discarded the README TODOs rather than transferring them.

The existing subquest boundaries are mostly useful. The main weakness is the connection between them: the parent retains competing implementation proposals, shared delivery infrastructure lacks bounded ownership, and the phase graph blocks work that the child briefs explicitly allow. Keep the current subject quests and tighten the parent before expanding the hierarchy.

## Evidence and limits

Read the beta plan, all eight child specs, API and documentation work records, the current date-picker follow-up, evergreen design guidance, package/build/CI configuration and representative source/tests. `npx --no-install playwright test --list` passed and discovered 162 project cases across five files: 54 cases per browser engine. This verifies discovery only. No product suites or builds were rerun, no remote CI result was retrieved, and no new browser or assistive-technology behavior was established. External browser-support claims in earlier research were not revalidated for this organizational review.

An independent review by a fresh Sol agent at high effort assessed the same committed design state. It confirmed the sequencing, competing records, release-evidence and ownership findings and identified the forms/field boundary below. Its review preceded creation of the infrastructure quest; that addition received local document checks.

## Findings

### R1. High: the parent still competes with its subject records

Beta's delivery plan at the reviewed revision labels unsettled details as proposals, but its phase exits, component inventory, accessibility recipes and composable table still specify their implementation. Examples include `bunt-form` as a separate component, `useForm.reset`, a particular select/combobox split, announcement timing and detailed overlay semantics. [Forms](../../validation-forms/spec.md) leaves the returned form shape and reset policy open; [selection](../../selection/spec.md) owns the naming choice. A blanket precedence note helps interpretation but leaves multiple places to maintain every subsequent decision.

Proposed change: beta keeps milestone outcomes, shared constraints, dependencies and release criteria. Each subject spec owns its proposals and decisions. The component inventory stays in beta, with the scope and owning record for each outcome; it should not prescribe unresolved roles, signatures or implementation recipes. Keep superseded detail as dated evidence only after checking that every surviving requirement has a current home.

### R2. High: the phase graph overstates dependencies and understates the live-CSS gate

Phase 1 at the reviewed revision requires all four contracts before any composite lands. Phase 2 requires the own validation model and removal of Vuelidate. The phase dependency graph then puts all of Phase 2 before overlays. That conflicts with the child briefs' explicit allowance for independent packaging, initialization, ordinary field and overlay design while forms remain deferred. Validation removal is also listed again in Phase 4.

Conversely, observer replacement is deferred without a distinct delivery gate for the accepted promise of live CSS presentation. Native transition experiments can accept injected resolved values, as the overlay brief already explains, but that cannot prove actual stylesheet-driven updates. Required behavior still needs an observation mechanism that passes its scenarios, whether or not the observer implementation is replaced.

Proposed change: separate dependencies needed to design an outcome from those needed to ship it. Remove the blanket all-contracts/all-infrastructure prerequisite. Keep forms behavior as a gate for form integration, observation evidence as a gate for live presentation, and selection taxonomy as a gate for the select's public API. Retain the existing deferrals; mark the affected outcomes blocked until those scopes resume.

### R3. High: verification infrastructure needs an executable first outcome

[CI](../../../.github/workflows/ci.yml) has lint, library/docs builds and three browser jobs. It has no type-check, unit-test or packed-consumer job. [package.json](../../../package.json) has no declaration generation, `types` entry, `vue-tsc`, Vitest or axe dependency. These are partly anticipated in the reviewed testing/documentation section and [packaging](../../packaging/spec.md), but their setup is mixed into the large Phase 2 delivery brief. The recorded green picker results are historical and cover two engines; the current full CI baseline remains unverified.

Disposition: the owner requested the separate [infrastructure quest](../../infrastructure/spec.md), now planned with implementation unassigned. Its proposed first outcome records a green baseline for a named commit, generalizes the existing [isolated picker fixture](../../../tests/fixtures/DatePickers.vue), adds shared axe/keyboard/ARIA/media-mode helpers, and connects the selected type-check/declaration and packed-consumer checks. Keep useful docs smoke tests; component correctness should also be reproducible without relying on a particular public example. Add pure unit-test support when the first extracted state logic needs it. Native focus, CSS and overlay behavior stay in browser tests.

The browser matrix must distinguish engine regression coverage, evidence at the promised browser floor and named manual AT combinations. [Architecture](../../../design/architecture.md) already requires feature-specific checks; a recent Playwright engine result does not demonstrate the entire minimum-version promise. [Manual AT ownership](../work/release.md#people-and-external-evidence) is already an open question. Arrange machines and testers early, including Safari/iOS and Windows contrast themes, instead of discovering unavailable evidence at release.

### R4. Medium: shared application services have an ownership gap

[Initialization and strings](../../app-configuration/spec.md) owns reactive configuration, isolation and disposal. Beta separately proposes an installer-created global `useAnnouncer` host with fixed delays and clearing behavior. No brief owns how announcements work with individual component imports, two applications, app unmount, native modal overlays, duplicate messages or existing picker-local live regions. These choices affect buttons, fields, pickers and toast.

Disposition: the new infrastructure brief owns announcement-service mechanics and shared accessibility styles. Initialization retains reactive configuration and dictionary lookup; overlays supply modal constraints; field/forms and other consumers own announcement policy. Verify usable announcements inside a native modal, multiple app roots, disposal and import-without-plugin behavior. Keep announcement timing as a candidate until tested. This assigns the questions without adopting an implementation.

### R5. Medium: remaining picker work has no clear delivery owner

The [picker work record](../work/date-pickers.md#delivered-outcome) preserves locale-aware segment order/display, two editable range inputs and mobile modal presentation as remaining work. Beta points to those follow-ups, but the Phase 0 record primarily owns baseline repair. App configuration supplies locale values, selection excludes parsing, field wiring supplies connections, and overlays supply transitions. None owns the complete remaining editing experience.

Proposed change: retain a picker delivery brief in beta naming the owner of locale-sensitive editing, range drafts and responsive presentation, with explicit beta-versus-later scope. Open a focused work spec when selected. Make the number input's locale parsing and the picker parser cooperate only where their actual requirements overlap. Do not create a generic parser abstraction before either design is settled.

The same scope pass should identify the intended form surface, single/multiple slider thumbs and the already-open multi-select question. Keep unresolved controls as briefs until selected. The accepted primed-view model needs a representative workflow and typing proof; it does not require a separate loader/editor product commitment.

### R6. Medium: acceptance needs a few explicit cross-topic scenarios

The existing accessibility criteria, overlay focus cases, field connection and forms async/reset scenarios are substantial. The following additions concern their intersections rather than a new component catalog:

| Scenario to make explicit | Proposed owner | Reason |
|---|---|---|
| Live CSS updates with reduced motion enabled, consumer transition declarations and a hidden subtree becoming visible | Observer, coordinated with shared styles | The observer candidate uses transitions while the motion proposal sets durations to zero; compatibility needs evidence. This review did not reproduce a failure. |
| Announcement and error feedback while a native modal is open, including nested overlays | Infrastructure + overlays + field/forms | A host outside the active modal needs an explicit accessibility check; persistent regions alone are insufficient evidence. |
| IME composition, paste/undo, autofill and mobile keyboard editing | Field wiring + selection; picker/number delivery for parsing | Desktop arrow-key tables do not cover ordinary text entry. Preserve the picker clipboard cases already in its interaction record. |
| Native `FormData`, implicit Enter submission, external `form` association and reset for ordinary/composite controls | Field wiring, with forms for validation/reset policy | Serialization is named in the field brief, but expected native behavior and representative cases are not explicit. Ordinary controls need a stated contract outside `useForm`. |
| Locale/configuration changes during a draft, then popup/embedded switching and failed-submit focus | Picker delivery + field/forms + overlays | Individually correct contracts still need one combined value/draft/focus scenario. |
| Mount/unmount cleanup and observer cost with a realistic control-heavy screen | Observer + infrastructure + initialization | The existing large-DOM theme test is useful but does not measure hundreds of observed controls or repeated disposal. |

These are proposed acceptance cases. Their precise behavior belongs to the named owners; this review does not settle it.

### R7. Medium: release scope is broader than tagging beta.1

The final phase ends with a tag. [Packaging](../../packaging/spec.md#evidence-and-completion) already requires a packed consumer, but [package.json](../../../package.json) still places Vue only in development dependencies while [the build](../../../vite.config.js) externalizes it. The public Vue compatibility/peer contract, alpha-to-beta migration inventory and release evidence aggregation need explicit ownership. Preserve the already accepted direct removal of Vuelidate without adding an adapter or deprecation period.

Proposed change: packaging owns supported Vue versions, runtime/peer dependencies, export compatibility and the actual packed JS/CSS/declaration/Node-import checks. A bounded beta release work item collects the final component scope, manual evidence, human-authored guides, mechanical references, migration notes and release-artifact verification. Human authors for narrative docs and integrated examples are already required in beta; give that dependency a concrete owner and completion condition. Publication remains a separate action.

### R8. Medium: older working records remain outside the agreed map

At the reviewed revision, the tracked root `datepicker-plan.md` still instructed focus trapping and described older APIs without a historical-status marker. Its requirements are now accounted for in the [picker reconciliation](../work/date-pickers.md#retired-root-plan-reconciliation). The current [picker follow-up](../work/date-pickers.md#delivered-outcome) describes Tab leaving the picker and closing it. The root [README](../../../README.md) then had its own backlog, while [TODOs.md](../../../TODOs.md) claims the single-backlog role and its status summary omits newer open entries.

Proposed change: reconcile useful requirements from the root picker plan, then put the historical plan under quest evidence/archive with repaired references. Reconcile README tasks into the authoritative backlog or owning scope. Keep `quests/README.md` as navigation and each spec as the authority for status. Avoid duplicating mutable status in several indexes. Completed design decisions can remain accepted even while a work record still awaits acceptance of its overall outcome.

### R9. Medium: forms and field wiring need an explicit handoff

[Field wiring](../../field-wiring/spec.md#required-contract-and-evidence) owns the internal connection signature, registration and DOM wiring. [Forms](../../validation-forms/spec.md#decisions-still-needed) also lists the internal control connection among its decisions. Their prose recognizes the dependency, but their open-question lists can lead both scopes to design the same protocol.

Proposed change: forms defines logical identity, value/draft state, validation participation and reset semantics; field wiring defines the control attachment interface that realizes those semantics through DOM ids, attributes, interaction reporting, focus and ARIA. Give that handoff one owning signature and link its required forms decisions. This leaves ordinary naming/outline work independent and prevents two competing state models.

## Proposed order of work

This replaces blanket phase dependencies with the prerequisites of each outcome. The owner accepted this order as planning guidance. It does not assign product execution.

| Order | Outcome | Gate and useful stopping point |
|---|---|---|
| 1 | Reconcile beta scope and ownership | One milestone inventory, proposal/decision distinction, explicit picker scope and delivery owners; existing forms/observer deferrals preserved |
| 2 | Establish verification and package groundwork | Named CI baseline, reusable browser fixture, typing/declaration feasibility and packed consumer; resolve the existing reactivity-transform policy question before expanding composables |
| 3 | Design the independent shared contracts | App configuration, infrastructure services, ordinary field/outline and overlay transitions can proceed independently; selection settles taxonomy before its consumer API |
| 4 | Prove one representative control through the whole stack | One ordinary field/picker scenario consumes its required contracts, exercises packaging/types, styling, focus and feedback, and gets early manual AT evidence |
| 5 | Resume deferred prerequisites when their consumers require them | Observation before shipping live CSS behavior; forms behavior and connection before shipping validation integration; their unresolved state stays visible |
| 6 | Deliver the remaining component families | Reuse proven behavior where responsibilities match; give complex controls their own bounded design when selected; verify combined form/dialog/picker behavior |
| 7 | Close the release | Accepted scope, final artifact, migration/reference docs, human narrative docs and recorded manual evidence |

Rows 4 and 5 can interleave: a slice that promises live CSS updates or form validation needs the relevant deferred prerequisite first. Contract exploration can use a smaller prototype while explicitly leaving those delivery criteria open. Packaging starts early and gains consumer cases as public surfaces become real.

Overlay lifecycle remains a good next product-design topic. It has wide reuse and a concrete open-calendar transition case. It need not wait for completed forms design, nor should the infrastructure work wait for every overlay decision.

## Proposed topic format

Use one owning spec per topic. Start a discussion with its next concrete decision, the consumer example that exposes it, and any inherited constraints. Carry only enough detail to answer that decision.

1. State the intended user outcome and two or three representative scenarios, including one failure or recovery case.
2. Separate accepted constraints, source observations and open choices. Link existing decisions instead of copying them.
3. Compare credible options using consumer code and observable behavior. Give a recommendation and its strongest drawback. Specify what the choice unblocks.
4. If evidence is missing, define the smallest probe, what it must reveal and its stopping point. Use a runnable fixture when interaction or visual design is the question.
5. Record the chosen contract, alternatives and remaining uncertainty once. Add implementation tasks only for the selected bounded outcome.
6. Deliver and verify that outcome, including the shared scenarios it consumes. Keep criterion-to-evidence links and the state tested; obtain outcome acceptance and promote lasting guidance to `design/`.

Do not force each topic through a long document template. Settled routine work can use a short brief and direct verification. A subquest is warranted when an area has its own consequential questions; a work spec is enough for a bounded implementation or check. Do not turn every component or composable into a quest.

## Proposed organization

| Home | Keep there |
|---|---|
| `quests/beta/spec.md` | Goal, component/scope inventory, shared constraints, dependency map, active scope, release criteria and parent decisions |
| Existing sibling quest specs | Each subject's current question, local design, decisions, inherited constraints, verification and continuation state |
| `quests/infrastructure/spec.md` | Verification and shared accessibility groundwork, with a separate implementation executor; bounded work records within that quest only as needed |
| `quests/beta/work/` | Selected bounded picker delivery or combined release work; create records as needed |
| Owning quest's research/prototype files | Dated evidence and experiments, with enough context to distinguish them from current contracts |
| `design/` | Accepted reusable contracts and rationale, with implemented/planned distinctions |
| `docs/` | Human-authored narrative plus permitted mechanical API and evidence documentation |
| `TODOs.md` | Work outside the selected quest scope; entries transferred into beta become pointers |

The owner accepted this working format. Current scope and continuation are in beta; historical findings above remain evidence of the reviewed state.

## Disposition, 2026-09-19

The owner accepted the recommendations and authorized the documentation consolidation. The [beta plan](../spec.md) now owns scope and actual dependency gates; component details are with their subjects or bounded delivery briefs. [The documentation record](../work/documentation.md#readiness-reconciliation-2026-09-19) carries the complete change boundary and verification.

| Finding | Disposition |
|---|---|
| R1 competing parent proposals | Detailed candidates routed to subject owners and the component brief; parent retains the inventory and shared constraints |
| R2 phase dependencies | Replaced with outcome prerequisites; forms and observation still gate only the delivery that consumes them |
| R3 verification infrastructure | Planned infrastructure quest with separate executor; implementation and current baseline remain unstarted/unverified |
| R4 application services | Infrastructure owns announcer mechanics; initialization owns dictionaries; consumers own announcement policy |
| R5 picker ownership | Date-input work owns remaining editing and presentation; beta retains scope decisions |
| R6 integration cases | Added to field, selection, observer, infrastructure, picker and release records; expected local behavior remains to be decided where needed |
| R7 release evidence | Release matrix, contributor gaps and artifact/migration preparation recorded; packaging owns compatibility and consumer checks |
| R8 competing older records | Root picker requirements integrated and plan deleted; README TODOs discarded at the owner's instruction; future picker candidates retained in the single backlog |
| R9 form/field overlap | Forms owns logical semantics; field wiring owns the single mounted-control attachment signature |

The organizational findings are addressed in the records. Product behavior, manual results, the CI baseline, unresolved local design choices and publication remain outstanding under their owning scopes.
