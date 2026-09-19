---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: select ordinary-field wiring or the outline question before investigation
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Field wiring

Define how ordinary controls expose one accessible logical field and connect to the eventual form workflow. Own DOM naming, attributes, feedback attachment, readonly interaction and the outline decision. Validation policy and public form authoring belong to [validation/forms](../validation-forms/spec.md).

Definition authority: the owner's 2026-09-18 request to define more subquests, recorded in [beta](../beta/spec.md#authority-and-current-state). This is a planned design scope. Inherit beta's shared API, architecture and accessibility constraints; investigation, prototypes and implementation await selection of their scope.

## Required contract and evidence

Inherited: ordinary controls expose the [shared field vocabulary](../../design/api-design.md#shared-field-vocabulary); selected values survive CSS presentation changes. The field contract must cover input, select, both date pickers, future groups and the optional `bunt-field` wrapper.

Design the control connection around value access, draft/parse state, whole-field interaction, feedback and focus attachment. The public template can expose that connection through a prop, binding object, slot or renderer later. Accessible naming, attribute routing, readonly behavior and the outline prototype can proceed before that choice; validation participation and reset wiring depend on the corresponding Phase 1.4 behavior decisions. The proposed editor-selecting `Field` renderer and the label/hint/error wrapper remain separate responsibilities until their relationship is designed.

- Define label, hint and error slots and their text-prop precedence; stable accessible names; generated ids; description merging; native versus ARIA state; compact layout that keeps errors available. Resolve error associations, announcements and failed-submit focus against the [Phase 1.4 accessibility proposal](../validation-forms/spec.md#accessibility), including its screen-reader verification cases.
- Specify attribute routing to the root and interactive elements, group semantics and focus targets. Whole-field `readonly` must cover selection, clear actions, presets and keyboard editing; decide which inspection/navigation remains available.
- Consume Phase 1.4's validation results and form-participation policy. Specify the logical-field registration interface, model serialization, reset plumbing and any native-validity synchronization for composite controls.
- Prototype the floating-label outline replacement before new field types adopt it. Evidence: [JS bridge inventory](../../design/js-bridge-inventory.md). Keep the current helper until the prototype answers the notch question.
- Define how embedded/popup switching preserves value, draft state, accessible naming and a usable focus target together with the [overlay contract](../overlay-lifecycle/spec.md).

Done when the internal signature, emitted semantics, forwarding rules and representative input/select/date/group scenarios are documented and the necessary outline/focus probes have observations. Public validation behavior must be decided before its wiring is finalized.

Clear-control visibility belongs here: choose its CSS token names, defaults, grammar and invalid-value handling while preserving the distinction between presentation and requiredness. Overlay tokens belong to the overlay quest.

## Questions and dependencies

| Shortname | Question | Type | Dependency |
|---|---|---|---|
| field-dom | How do labels, descriptions, ids, attributes and focus targets work across input, select, picker and group controls? | decide, prototype | Shared field vocabulary; accessible feedback policy from forms before final error wiring |
| readonly-clear | What can a readonly field still inspect or navigate, and how do clear controls behave? | decide | Accepted application-state versus CSS-presentation boundary |
| outline | Which intrinsic label and border treatment can replace the measured SVG outline? | prototype, decide | [Bridge inventory cases](../../design/js-bridge-inventory.md#outline-decision); coordinate joined select outline with selection and overlays |
| field-connection | What connection carries values, drafts, interaction, feedback, participation and reset? | decide, prototype | Forms behavior decisions for integration; template spelling can remain open |

Ordinary naming, attribute routing, readonly behavior and the outline experiment can be selected independently of form integration. Keep the outline as a bounded question in this quest unless its investigation needs a separate work spec.

Future durable output: a field contract in `design/` and the resulting outline decision in the bridge inventory. Required feedback and focus observations remain explicit until verified; defining this quest supplies no test evidence.
