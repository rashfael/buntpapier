---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: discuss an open-dialog modality transition and choose the first investigation
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Overlay lifecycle

Define logical open state, native event reconciliation, focus and dismissal across popup, modal and embedded presentations. Own native lifecycle and overlay CSS policy; [style observation](../style-observer/spec.md) owns detecting resolved policy changes.

Definition authority: the owner's 2026-09-18 request to define more subquests, recorded in [beta](../beta/spec.md#authority-and-current-state). This is a planned design scope. Inherit beta's shared API, architecture and accessibility constraints; investigation, prototypes and implementation await selection of their scope.

On 2026-09-20 the owner narrowed popup/embedded switching to unspecified behavior. This supersedes that transition's earlier value/draft/focus preservation requirements. Both stable modes remain supported; other live CSS policies, including modality, stay in scope. No transition implementation is requested.

## Required contract and evidence

Inherited: CSS configures placement, size, modality and dismissal. Resolved policy updates apply while open. Reading only at opening was rejected.

- Choose token names, defaults, value grammar and invalid-value handling, including calendar presentation. Field wiring owns clear-control visibility.
- Define how native popover/dialog events and open requests agree with logical open state. Switching native modal/non-modal modes must preserve the workflow and account for native close/cancel/toggle events.
- Specify focus behavior when changing modality while a control is active, including nested overlays, unavailable focus targets and restoration.
- Verify observer detection for behavior-affecting reads and avoid presentation changes feeding back into repeated open/close operations. The [style-observer investigation](../style-observer/spec.md) remains deferred; its eventual design must satisfy live updates.

Done when a state-transition table and probes cover live mode changes, focus preservation, dismissal, nested overlays and native event reconciliation. Candidate CSS spellings in Phase 1.3 remain illustrative until this contract is decided.

## First case and boundaries

Use an open dialog whose CSS modality changes. Preserve its workflow and define focus behavior and native-state reconciliation. Popup/embedded calendar switching is excluded. Cover nested overlays and missing restoration targets as part of the same contract.

The selection quest owns active-item and selected-value semantics. Existing input contracts owns ordinary control naming and focus targets; forms owns logical draft semantics and form attachment, and picker delivery owns editing behavior. This quest owns how their state and usable targets survive native transitions. Primed-view mount rules apply only when a selected overlay workflow uses a primed view.

## Questions and dependencies

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| native-state | Which states, requests and native events describe opening, closing and changing presentation? | decide, prototype | Existing picker behavior and accepted live CSS policy |
| transition-focus | Where does focus go through modality changes, nesting, dismissal and unavailable targets? | decide, prototype | Coordinate field focus attachment and selection's active item |
| overlay-tokens | Which overlay tokens, defaults and invalid-value rules express those policies? | decide | Shared props/CSS boundary; token spellings remain proposals |
| live-detection | Does detection plus the native transition preserve the live-update guarantee? | prototype, unblock | Observer scope resumed and sufficient detection evidence on the browser target |

Transition design can proceed while observation remains deferred. A probe supplied with resolved policy changes could isolate native behavior; it would leave end-to-end CSS detection unverified. Production positioning, clipping and the component migrations below remain planned until separately selected.

## Deferred tooltip interaction decision

On 2026-09-21, after the [regression investigation](../field-wiring/work/tooltip-regressions.md) and [accessibility research](../field-wiring/work/tooltip-accessibility-research.md), the owner said they would compromise on behavior like a native `title` tooltip, with future improvement, but did not want to spend time on the more conscious interaction decision now. Record native-title-like behavior as a provisional fallback direction. This does not select literal replacement with the HTML `title` attribute, adopt geometry tracking or settle exact hover, focus, activation and forced-error semantics. The confirmed animation, click-through and accidental-activation regressions remain open.

This quest owns revisiting the compromise when the owner selects tooltip interaction work or before claiming the tooltip accessibility contract complete. Compare the native-like fallback with hover-persistent custom behavior while preserving the owner's intentional click-through requirement. Geometry tracking belongs to this later quest as an implementation candidate, as explicitly clarified by the owner on 2026-09-21. Evaluate pointer corridors, repositioning, overlapping controls, zoom and pointer-driven assistive technology here if that candidate is selected. It is outside the current compatibility repair and is not a prerequisite for that repair. Use the existing research and browser baseline; resolve activation dismissal, forced-error feedback and pointer-driven assistive-technology behavior together. A custom tooltip imitating native behavior does not inherit the user-agent exemption recorded in the research. The deferral supplies no conformance or acceptance claim. The owner subsequently authorized the bounded compatibility repair; geometry tracking and the broader interaction redesign remain deferred.

## Delivery brief

The planned [input/select work package](../field-wiring/work/input-select-contracts.md) includes direct component attachment for `v-tooltip`, control description association, hover/focus persistence including pointer travel onto the tooltip, and Escape dismissal using the existing tooltip implementation. Its design-review amendments were accepted on 2026-09-20 and an implementation was retained after comparison. On 2026-09-21 the owner reopened shared-tooltip compatibility; the [regression investigation](../field-wiring/work/tooltip-regressions.md) records lost motion, click-through and accidental trigger activation. The owner subsequently approved the [compatibility repair](../field-wiring/work/tooltip-regressions.md#approved-compatibility-repair-2026-09-21): restore motion and click-through, dismiss ordinary explanations on activation, distinguish keyboard from mouse focus and preserve forced-error dismissal. The repair is implemented and independently reviewed; its verification and remaining external evidence are recorded with the repair. This temporarily relaxes tooltip hover persistence. This quest owns reconsidering that compromise, geometry tracking, native positioning and wider tooltip policy.

This quest owns the native overlay foundation and its tooltip, dialog and popover consumers. Selection owns select/combobox migration; [component briefs](../beta/work/components.md) own menu and toast. The owner accepted this delivery routing on 2026-09-19; it does not settle local signatures or start implementation.

- Retire Floating UI, Popper, the host `#bunt-teleport-target` requirement, copied dropdown theme styles and the duplicated select input strip only after their consumers migrate. Verify inherited theme context, trigger width, available-height clipping, nested scrollers, viewport edges, placement fallback and the joined outline on the supported browser target. The bridge inventory owns each retirement condition.
- Candidate internal responsibilities are `useOverlay` for native popover state/anchors, `useDialog` for modal lifecycle, and `useDismiss` for dismissal the platform does not supply. Reconcile native `toggle`, `cancel`, `close` and close requests with logical state, including topmost Escape ordering and interrupted transitions. Exact helper boundaries follow the contract rather than an estimated line count.
- Candidate presentation properties include `--popover-placement`, `--popover-offset`, `--dialog-size` and `--dialog-placement`, with size/placement/modality/dismissal updating live. Define grammar and invalid values here. Compare native anchor positioning, `position-area`, fallback placement, scroll locking and starting/closing transitions through probes. A drawer-specific API waits for an actual drawer workflow.
- Tooltip delivery retains `v-tooltip` as sugar. Cover hover delay/warm-up, keyboard focus, pointer travel over the tooltip, Escape, blur/leave and touch behavior, with a noninteractive tooltip and a stable trigger description. The proposal to derive an otherwise missing icon-button name from tooltip content needs an explicit naming decision and AT evidence.
- Dialog delivery covers title association, initial focus, modal versus nonmodal behavior, dismissal, scroll locking, restoration and alert-dialog use. Popover delivery covers rich anchored content and keyboard entry/return. Earlier role/ARIA workarounds are hypotheses to verify on the supported combinations, not blanket rules.
- Coordinate the announcement service with native modal/nested overlays. Verify that messages and error feedback remain available to the intended user while the modal is active.

Do not add a generic focus trap without a real contained-focus consumer; the architecture retains a small dependency as an option if such a case appears. Native lifecycle observations, three-engine regression tests, applicable manual AT evidence and migration notes are required before claiming the positioning dependencies removable.

Future durable output: an overlay lifecycle contract in `design/`, with its state-transition table, browser observations, focus scenarios and remaining integration dependencies.
