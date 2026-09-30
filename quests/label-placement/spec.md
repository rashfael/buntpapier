---
status: planned
parent: ../beta/spec.md
active: []
activity: design
next: when selected, compare additional label placements using real consumer layouts
waiting_on: owner-selection
profile: unassigned; no investigation or implementation started
---

# Future label placement

Decide which additional label placements buntpapier should supply, including labels on the left for horizontally arranged forms. The current [Material v2 floating-label appearance](../../design/appearance.md#label-appearance) stays. This quest asks where optional alternatives help consumers and how they should behave across the input family.

## Authority and boundary

On 2026-09-20 the owner accepted the existing-input contract scope with the amendment “floating-label is our current look'n'feel and stays this way” and requested a separate quest asking which placements to supply in future, “like labels on the left”. Creating this brief is authorized; its investigation and implementation await selection. It is future work, with no new beta acceptance dependency. [Existing input contracts](../field-wiring/spec.md) continues independently.

Inherit the [API boundary](../../design/api-guide.md#props-slots-and-css): label content belongs in props/slots and label placement is presentation configured through CSS. Preserve accessible names and focus behavior across placement changes. A placement option must work on ordinary inputs without a required form or field wrapper.

## Questions to investigate when selected

| Question | Type | Evidence and dependency |
|---|---|---|
| Which placements have useful consumer cases: floating, above, inline-start/left, or others? | research, decide | Compare actual forms, dense settings and responsive layouts; the floating default is settled. |
| Does alignment belong to each input, a shared layout container, or both? | prototype, decide | Several controls with different label lengths, wrapping hints/errors and a narrow viewport; defer form integration to forms. |
| What should happen when space shrinks or labels grow? | prototype, decide | Translated labels, custom fonts, zoom and logical start/end layout; no physical-left-only API commitment. |
| Which public CSS properties express placement, alignment and spacing? | decide | Select useful placements and layout ownership first; token names are not reserved by this brief. |

Compare a CSS placement option on ordinary controls with an application-owned label/control layout. The first offers consistent library behavior; the second may already cover rare layouts without increasing the public API. A shared field wrapper is a separate forms decision and is not a prerequisite for this exploration.

Acceptance needs representative visual examples, keyboard/naming observations, an explicit set of supported placements or a decision to leave them application-owned, and the owner's assessment of the look. Do not treat a list of possible placements as a delivery commitment. Any accepted contract belongs in `design/`; implementation requires its own bounded authorization.

## Existing evidence

[The input styles](../../src/styles/components/input.sass), [input outline helper](../../src/utils/input-outline.ts) and [bridge inventory](../../design/js-bridge-inventory.md#outline-decision) document the current floating-label arrangement and its geometry. Earlier plans compared replacing it with a label above the control; that replacement direction is superseded by the owner's retained-appearance decision. Additional placements remain open. No visual prototype or browser/AT evidence exists for them here.
