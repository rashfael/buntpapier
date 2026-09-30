---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: when selected, prototype accessible feedback within the compact height constraint
waiting_on: owner-selection
profile: unassigned; no investigation or implementation started
---

# Feedback in compact inputs

Find how compact inputs expose guidance and errors without consuming the vertical space of a normal input. Hint suppression is intentional; losing access to feedback is an unresolved gap.

## Authority and evidence

On 2026-09-20 the owner requested a future quest for this gap and recalled an intended maximum height around 36px, explicitly uncertain. Current [input styles](../../src/styles/components/input.sass) set both compact root and input height to 28px and hide `.hint`; comments describe a dense control without label/hint headroom. Confirm the desired height ceiling when this quest is selected. This brief does not change dimensions or reveal hints.

[Input](../../src/components/input.vue) and [select](../../src/components/select.vue) render validation messages in the same `.hint` area. They also expose an error icon with a title, but this is not evidence of usable keyboard, touch or screen-reader feedback. The gap already exists with their current validation path and does not depend on adding standalone error props.

## Questions for later design

- Where can a user find the full message without increasing each compact row's height: adjacent shared space, an explicitly opened message, or another arrangement?
- How is feedback discoverable with keyboard and touch, and associated with the control for screen readers?
- How do long messages, multiple errors, correction and compact/noncompact switching behave?

The owner authorized recording future work, not selecting a solution or implementing it. Revisit when compact feedback is selected or before delivering validation feedback for compact controls. [Input contracts](../field-wiring/spec.md) can continue; [forms](../validation-forms/spec.md) consumes the eventual presentation. Existing accessibility requirements remain unresolved until this gap is addressed or the supported compact-validation scope is explicitly narrowed.

Acceptance needs a visual example at the agreed height, accessible message discovery and correction on keyboard/touch, and the project's required AT observations. Simply removing `display: none` is not an accepted solution.
