# Research: Hoverable tooltips without accidental activation

**Date:** 2026-09-21
**Scope:** Bounded source research
**Query:** Does WCAG require a custom tooltip to receive pointer events, and can buntpapier preserve click-through behavior while making the tooltip hoverable, persistent and dismissible?

## Summary

The hoverable requirement is real: an author-made tooltip that opens on pointer hover falls under WCAG 2.2 success criterion 1.4.13, and moving the pointer over its visible content must not make it disappear. The requirement is about the observable behavior, not a prescribed DOM hit target. WCAG does not require tooltip text selection, pointer-event interception, focus inside the tooltip or click activation. A `pointer-events: none` tooltip kept open by pointer-coordinate geometry is therefore a defensible conformance approach, but W3C does not explicitly bless that implementation and it gives up some conventional hit-testing behavior. The owner has confirmed that click-through was intentional for tight interfaces, so preserving it is a compatibility requirement rather than an unresolved preference.

## Findings

### What WCAG 1.4.13 requires

[WCAG 2.2 SC 1.4.13](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus) is normative Level AA text. It applies when receiving and removing pointer hover or keyboard focus shows and hides additional content. For a custom hover tooltip it requires all three of these outcomes:

- **Dismissible:** the user can dismiss content that obscures or replaces meaningful content without moving pointer hover or keyboard focus. An input error and content that obscures only whitespace or decoration are exceptions.
- **Hoverable:** the pointer can move over the additional content without it disappearing.
- **Persistent:** it stays until hover or focus is removed, the user dismisses it, or the information becomes invalid.

The [W3C Understanding document](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) explains the reason for hoverability: a magnified view or large pointer may obscure the tooltip, so the user needs to move the pointer across it to see the rest. It also notes an advantage for screen-reader feedback driven by mouse movement. These explanations are informative; the success-criterion text above is the conformance requirement.

The [SCR39 sufficient technique](https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR39.html) uses a functional test: move the pointer over the additional content and confirm that it does not disappear, does not time out and can be dismissed without moving the pointer away. W3C explicitly says techniques are examples rather than required implementations. Neither the criterion nor SCR39 says the tooltip element must be the browser's pointer-event target.

### Native `title` is exempt, but is not an equivalent replacement

SC 1.4.13 exempts additional content whose visual presentation is controlled by the user agent and unmodified by the author. Its first note names a browser tooltip generated from an HTML `title` attribute as an example. This is a narrow exemption from 1.4.13, not a statement that `title` supplies equivalent keyboard and assistive-technology access.

The [HTML Standard](https://html.spec.whatwg.org/multipage/dom.html#the-title-attribute) discourages relying on `title` because user agents often expose it poorly. Some interfaces require a mouse and exclude keyboard-only and touch-only users. W3C's [H89 technique](https://www.w3.org/WAI/WCAG21/Techniques/html/H89) likewise says user agents and assistive technology do not always expose it and advises against using it alone. Replacing the custom tooltip with `title` would avoid this one criterion while weakening the project's focus explanation.

### Hoverable does not mean focusable, selectable or clickable

The [ARIA Authoring Practices tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) says focus remains on the trigger, the tooltip itself does not receive focus, Escape dismisses it, and a pointer-opened tooltip stays open while the cursor is over the trigger or tooltip. A surface containing focusable elements should use a non-modal dialog instead. This APG pattern is explicitly work in progress and lacks task-force consensus, so it is useful implementation guidance rather than a normative WCAG rule.

The normative [WAI-ARIA 1.2 `tooltip` role](https://www.w3.org/TR/wai-aria-1.2/#tooltip) defines the tooltip as a contextual description and recommends connecting it with `aria-describedby`. It does not define text selection or click behavior.

WCAG 1.4.13 also does not require text to be selectable. Selection is a separate presentation choice. In this repository, `user-select: none` currently disables selection independently of `pointer-events`. Short labels can reasonably remain unselectable; content long enough to need interaction or reliable copying is a sign that a persistent help surface or popover may fit better.

Click handling is equally separate. Focus persistence explains why a tooltip may remain after a button click, but it does not force that behavior: activation may dismiss the tooltip as a user dismissal. SCR39 expressly allows activating the trigger as a dismissal mechanism. [React Spectrum](https://react-spectrum.adobe.com/Tooltip) defaults `shouldCloseOnPress` to `true`, which confirms that closing on activation is a normal design choice rather than a WCAG conflict.

### `pointer-events: none` plus geometry tracking

The [CSS Basic User Interface specification](https://www.w3.org/TR/css-ui-4/#pointer-events-control) defines `pointer-events: none` as excluding the element's boxes from ordinary hit testing so the element behind becomes the event target. That preserves the old click-through behavior. It also means tooltip `mouseenter`/`mouseleave` listeners and ordinary `:hover` cannot be the only persistence mechanism.

A document-level `pointermove` handler can compare pointer coordinates with the current tooltip rectangle, include a corridor between trigger and tooltip, and keep the tooltip visible while the pointer is physically over either region. This passes the literal SC 1.4.13 requirement and SCR39 test: the pointer moves over the visible additional content without that content disappearing. This conclusion is an inference from the technology-neutral criterion and its test procedure; no W3C source found explicitly evaluates `pointer-events: none` with synthetic geometry tracking.

The trade-off is real. Because the tooltip is absent from hit testing, pointer-driven assistive technology may encounter the underlying control instead of the visible description. That would lose one benefit named in the Understanding document. Click-through also permits activation of an obscured control and can trigger hover behavior on whatever lies underneath. A geometry approach needs tests at zoom, with large pointers, across the Popper gap, after repositioning and when another hover target sits behind the tooltip.

### What established libraries demonstrate

[Material UI](https://mui.com/material-ui/react-tooltip/#interactive) calls hover persistence “interactive” and enables it by default for SC 1.4.13. In that API, “interactive” means the tooltip stays open while hovered; it does not mean the tooltip contains controls or should activate its trigger. MUI's `disableInteractive` restores the older disappearing behavior and its documentation correctly identifies that as failing SC 1.4.13.

[React Spectrum](https://react-spectrum.adobe.com/Tooltip) opens tooltips on hover and focus, closes them on trigger press by default, shows none for touch interaction and recommends a popover or contextual-help control when users need a different interaction. Its current guidance also requires a focusable trigger, so its disabled-button policy does not directly map to buntpapier's deliberately focusable `aria-disabled` controls.

These libraries support hover persistence, keyboard access and an inert tooltip role. They do not support the inference that clicking visible tooltip pixels should activate the trigger button.

## Analysis

### Options for buntpapier

| Option | Hoverability | Click behavior | Main cost |
| --- | --- | --- | --- |
| `pointer-events: auto`, tooltip kept inside the trigger | Conventional hover tracking | Click bubbles into the button unless explicitly stopped | Tooltip geometry can activate an ancestor control |
| `pointer-events: auto`, tooltip rendered outside the activating trigger | Conventional hover tracking | Tooltip can absorb clicks without activating the button | Blocks clicking the obscured control until the pointer moves or the tooltip is dismissed |
| `pointer-events: none` with document-level geometry tracking | Meets the observable WCAG test if implemented correctly | Preserves click-through to the element under the tooltip | More state and edge cases; weaker hit-test exposure for pointer-driven assistive technology |
| Non-hover help surface for longer or actionable content | Avoids tooltip limitations | Explicit operation | More UI and a different component contract |

The first option is the bad one. A descendant tooltip is noninteractive in the ARIA sense, but a click on it bubbles through the activating button. That couples visual overlay geometry to an unrelated action.

### Candidate for the later overlay quest

Owner disposition, 2026-09-21: the recommendation below was not adopted. The owner expressed willingness to compromise on native-title-like behavior and deferred the more deliberate interaction decision to [future overlay work](../../overlay-lifecycle/spec.md#deferred-tooltip-interaction-decision). Keep this research as evidence for that decision, not an instruction to implement geometry tracking now.

Geometry tracking is a candidate for the later overlay quest, explicitly outside the current compatibility repair following the owner's 2026-09-21 clarification. That future design can combine click-through through `pointer-events: none` with hover persistence through geometry tracking, keyboard access, Escape and `aria-describedby`. If selected, evaluate it with magnification and the project's manual screen-reader combinations because the conformance argument is less conventional.

Rendering the tooltip outside the trigger's event ancestry with `pointer-events: auto` remains a technically sound alternative. It is easier to explain and audit, but it blocks clicks on covered controls and would reverse the owner's stated dense-interface behavior. That makes it the wrong default for this compatibility fix unless the owner later changes the contract.

Click-through still has a usability cost: users can activate controls that the tooltip partly obscures, and underlying hover targets may react while the tooltip is visible. Keep tooltip text short, position it away from likely targets where possible, retain Escape dismissal and test overlapping controls. Those costs do not override the explicit compatibility decision.

Do not treat text selection as part of this decision. Keep short tooltip text unselectable if that matches the visual component. Move longer, actionable or copy-worthy help to a popover or persistent help component.

## Open questions for the later overlay quest

1. **Does geometry tracking expose the visible description well enough to the supported pointer-driven assistive technology?** Run the manual NVDA/Firefox and VoiceOver/Safari observations already required by the quest, plus magnification and a large-pointer pass.
2. **What should trigger activation do while a tooltip is open?** Decide whether press dismisses before the action, after it, or only when the resulting state invalidates the description; none of these outcomes is dictated by SC 1.4.13.

## Sources

1. [WCAG 2.2, success criterion 1.4.13](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus): normative dismissible, hoverable and persistent requirements and the user-agent exception.
2. [Understanding SC 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html): informative intent, large-pointer and magnification rationale, and `title` example.
3. [Technique SCR39](https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR39.html): sufficient technique and observable test procedure.
4. [ARIA Authoring Practices tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): work-in-progress interaction guidance and its stated consensus status.
5. [WAI-ARIA 1.2 tooltip role](https://www.w3.org/TR/wai-aria-1.2/#tooltip): normative role semantics and `aria-describedby` guidance.
6. [HTML `title` attribute](https://html.spec.whatwg.org/multipage/dom.html#the-title-attribute): native semantics and warning against relying on inaccessible user-agent exposure.
7. [CSS UI 4 `pointer-events`](https://www.w3.org/TR/css-ui-4/#pointer-events-control): hit-testing behavior of `pointer-events: none`.
8. [Material UI tooltip](https://mui.com/material-ui/react-tooltip/#interactive): a production library's SC 1.4.13 interpretation.
9. [React Spectrum tooltip](https://react-spectrum.adobe.com/Tooltip): focus/hover behavior, close-on-press policy and alternative-component guidance.
