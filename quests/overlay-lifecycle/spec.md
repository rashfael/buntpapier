---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: discuss the open-calendar transition scenario and choose the first investigation
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Overlay lifecycle

Define logical open state, native event reconciliation, focus and dismissal across popup, modal and embedded presentations. Own native lifecycle and overlay CSS policy; [style observation](../style-observer/spec.md) owns detecting resolved policy changes.

Definition authority: the owner's 2026-09-18 request to define more subquests, recorded in [beta](../beta/spec.md#authority-and-current-state). This is a planned design scope. Inherit beta's shared API, architecture and accessibility constraints; investigation, prototypes and implementation await selection of their scope.

## Required contract and evidence

Inherited: CSS configures placement, size, modality and dismissal. Resolved policy updates apply while open. Reading only at opening was rejected.

- Choose token names, defaults, value grammar and invalid-value handling, including calendar presentation. Field wiring owns clear-control visibility.
- Define how native popover/dialog events and open requests agree with logical open state. Switching native modal/non-modal modes must preserve the workflow and account for native close/cancel/toggle events.
- Specify focus behavior when changing modality or embedded/popup presentation while a control is active, including nested overlays, unavailable focus targets and restoration.
- Verify observer detection for behavior-affecting reads and avoid presentation changes feeding back into repeated open/close operations. The [style-observer investigation](../style-observer/spec.md) remains deferred; its eventual design must satisfy live updates.

Done when a state-transition table and probes cover live mode changes, focus preservation, dismissal, nested overlays and native event reconciliation. Candidate CSS spellings in Phase 1.3 remain illustrative until this contract is decided.

## First case and boundaries

Use a calendar that is open with a keyboard-focused day when responsive CSS changes its presentation. Preserve the selected value and workflow under the accepted API; decide the resulting open state, focus target and treatment of an unfinished interaction. Cover nested overlays and missing restoration targets as part of the same contract.

The selection quest owns active-item and selected-value semantics. Field wiring owns logical-field naming, drafts and focus attachment. This quest owns how their state and usable targets survive native transitions. Primed-view mount rules apply only when a selected overlay workflow uses a primed view.

## Questions and dependencies

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| native-state | Which states, requests and native events describe opening, closing and changing presentation? | decide, prototype | Existing picker behavior and accepted live CSS policy |
| transition-focus | Where does focus go through modality changes, nesting, dismissal and unavailable targets? | decide, prototype | Coordinate field focus attachment and selection's active item |
| overlay-tokens | Which overlay tokens, defaults and invalid-value rules express those policies? | decide | Shared props/CSS boundary; token spellings remain proposals |
| live-detection | Does detection plus the native transition preserve the live-update guarantee? | prototype, unblock | Observer scope resumed and sufficient detection evidence on the browser target |

Transition design can proceed while observation remains deferred. A probe supplied with resolved policy changes could isolate native behavior; it would leave end-to-end CSS detection unverified. Production positioning, clipping and component migrations remain in beta's delivery phases until separately selected.

Future durable output: an overlay lifecycle contract in `design/`, with its state-transition table, browser observations, focus scenarios and remaining integration dependencies.
