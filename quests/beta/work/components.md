---
status: planned
parent: ../spec.md
activity: plan
next: select one component family and refine its local contract and acceptance evidence
waiting_on: scope-selection
profile: current owner-selected Codex session; model and effort not exposed
---

# Component delivery briefs

Deliver the beta-specific fixes and missing controls that do not belong to a focused contract quest. This record keeps required outcomes, candidate directions and dependencies together. It does not settle the candidates or authorize product investigation or implementation.

The owner approved the beta readiness review's organization and sequencing recommendations on 2026-09-19 and requested this planned delivery map. When a family is selected, refine only the decisions and acceptance needed for that outcome. Keep implementation tasks out of this record until they help execute or resume selected work.

## Shared delivery bar

Use the [API guide](../../../design/api-guide.md) for every family. Start with an ordinary component and a native element or behavior where it can meet the contract. Props, models and slots carry content, application state and data; CSS custom properties carry appearance and presentation policy. Presentation settings update live where the API promises that behavior. Any optional composable or primed view needs a shared workflow that justifies it.

Each selected public API needs type evidence for its models, props, emits, slots and exported declarations. [Packaging](../../packaging/spec.md) owns declaration and packed-consumer verification; the component family supplies representative positive and negative consumer cases.

Every interactive component must satisfy the full [accessibility acceptance checklist](../../../design/accessibility.md). That page owns the criteria; each family supplies its specific state, keyboard and manual-test evidence in the [release matrix](release.md). Decorative icons, including decorative MDI elements, must be hidden from assistive technology so they do not add unintended names or speech; meaningful controls still require an accessible name.

[Infrastructure and verification](../../infrastructure/spec.md) owns the shared focus, motion, forced-colour, target-size, visually-hidden and announcement mechanics and the common test setup. Each family still owns its specific semantics, announcement policy and evidence. [Initialization and strings](../../app-configuration/spec.md) owns dictionary lookup and overrides. Exact mechanisms and browser behavior remain candidates until verified against the supported browser floor and named assistive-technology combinations.

## Shipped controls

### Button and async feedback

Required outcome: every button has a usable accessible name, exposes loading state, prevents navigation as well as activation when a router-link button is disabled, and keeps its ink legible on supported surfaces. Local async feedback remains an ordinary component behavior.

Candidate direction: add a `label` input for icon-only buttons and a development warning when neither visible text nor a label provides a name; expose `aria-busy` during loading; remove `href` while a router-link variant is disabled; guard text ink to 4.5:1. Consume the shared announcer transport, then decide in this family which loading and outcome changes merit announcements and how repeated results behave.

### Text input

Required outcome: `bunt-input` follows the shared field vocabulary, forwards consumer attributes to the native input, reports invalid and readonly behavior consistently, and offers an accessible password reveal action without coupling callers to Vuelidate.

Candidate direction: keep the native input, style `:user-invalid` where it matches the selected policy, and add a dictionary-backed password reveal control for `type=password`. [Field wiring](../../field-wiring/spec.md) owns names, ids, attribute routing, feedback attachment, focus and readonly interaction. [Validation/forms](../../validation-forms/spec.md) owns validation state, timing and logical form participation. This delivery consumes those decisions instead of defining another connection model.

### Checkbox

Required outcome: `bunt-checkbox` exposes checked and indeterminate state, has a visible focus indicator on its visual box, removes the unsupported readonly promise, and remains distinguishable in forced colours and dense layouts.

Candidate direction: retain the native checkbox, map an `indeterminate` prop to the native property, use `:has(input:focus-visible)` for the visual focus ring when browser-floor evidence supports it, and offer the candidate `--checkbox-weight: subtle` presentation for dense tables. Text follows text contrast; the box boundary and checked indicator follow non-text contrast. Field connections come from [field wiring](../../field-wiring/spec.md), and shared media-mode styles come from [infrastructure](../../infrastructure/spec.md).

### Circular progress

Required outcome: `bunt-progress-circular` distinguishes determinate and indeterminate progress, exposes a name and numeric value when present, and avoids disorienting motion.

Candidate direction: first check whether a native progress element can meet the visual and API contract. Otherwise retain the custom rendering with `role=progressbar`, a label and applicable `aria-valuemin`, `aria-valuemax` and `aria-valuenow`. Replace continuous indeterminate motion with a reduced-motion treatment such as a slow fade only after the shared motion policy and browser evidence support it.

### Ripple ink

Required outcome: `v-ripple-ink` adds no motion when the user requests reduced motion and does not interfere with activation, focus or the control's accessible state.

Candidate direction: make the effect a no-op under the resolved reduced-motion policy. The [bridge inventory](../../../design/js-bridge-inventory.md) remains the source for geometry and retirement conditions; this brief does not broaden the ripple into a behavior primitive.

### Scrollbars

Required outcome: a `bunt-scrollbars` container can receive focus where needed and scroll fully by keyboard, without hiding content or essential state in supported contrast modes.

Candidate direction: keep the current component until a bounded spike shows that native `scrollbar-width` and `scrollbar-color` styling satisfies the visual, keyboard, forced-colour and browser-floor requirements. Replacement remains optional; verification of keyboard scrolling is part of beta delivery. The [bridge inventory](../../../design/js-bridge-inventory.md) owns the existing implementation facts and retirement condition.

## New form controls

All controls in this section consume [field wiring](../../field-wiring/spec.md) for DOM attachment and [validation/forms](../../validation-forms/spec.md) for form participation. Group labels and feedback must describe one logical field while preserving native form submission and reset behavior. Local design must cover IME composition, paste and undo, autofill and mobile input where those paths apply.

### Textarea

Required outcome: provide multiline text entry with the shared field vocabulary, native editing, controlled growth and an optional character counter whose visual and announced feedback stays useful without becoming noisy.

Candidate direction: a separate `bunt-textarea` built on `<textarea>`, with CSS such as `--textarea-rows-min` and `--textarea-rows-max` expressed in line-height units and `field-sizing: content` where supported. A fallback and the counter's announcement policy need browser and assistive-technology evidence.

Local design question: should textarea remain a separate component or become an input variant? The earlier recommendation favored a separate component, but this record leaves the choice open until consumer API, styling and type examples are compared.

### Number input

Required outcome: accept, edit, parse and step numeric values without losing invalid drafts, locale intent, native form behavior or usable mobile and assistive-technology interaction.

Candidate direction: compare a native number input with a text input using an appropriate decimal input mode, locale-aware parsing and optional stepper buttons. If custom spinbutton semantics are proposed, the keyboard, name/value exposure, mobile editing and screen-reader behavior need direct evidence. Do not create a shared locale parser with date inputs before both contracts reveal the same responsibility.

Local design question: should this use native number behavior or text entry with locale parsing and explicit spinbutton behavior? The earlier recommendation favored text entry with `Intl.NumberFormat`; it remains a proposal pending a prototype and supported-environment evidence.

### Radio group

Required outcome: provide native single selection with one group label, shared hint/error connections, disabled and required behavior, and the expected keyboard movement without inventing a second selection model.

Candidate direction: use native radio inputs in a `fieldset` with `legend` where that structure fits, styled in the same visual system as checkbox. The component boundary between `bunt-radio` and `bunt-radio-group`, value typing and attribute distribution remain local design work.

### Checkbox group

Required outcome: connect several native checkboxes as one labelled logical field while preserving each checkbox's name/value submission, focus and error discoverability.

Candidate direction: use a fieldset/legend group that consumes the existing checkbox and field connection. Refine the model shape, group-level versus item-level invalidity and typed values against concrete consumer cases; validation/forms owns the logical participation rules.

### Switch

Required outcome: expose a binary on/off setting with native checkbox behavior, switch semantics, an accessible label and clear checked, disabled, focus and forced-colour states.

Candidate direction: start with `<input type="checkbox" role="switch">` and native Space activation, then style its track and thumb through CSS. Verify that the chosen label and state wording remain clear in the required assistive-technology combinations.

### Slider

Required outcome: expose a numeric range with a usable label and value, native keyboard editing, an accessible pointer alternative and clear focus, boundary and forced-colour states. Multiple thumbs, if included, must preserve each thumb's identity, constraints and focus order.

Candidate direction: use one native range input per thumb with a custom CSS track, retaining native keyboard behavior and a click-on-track path where it satisfies the contract. Prove typed single- and multi-value models and the actual pointer and assistive-technology behavior before adopting that shape.

Local design question: does beta ship only a single-thumb slider or include a multiple-thumb surface? If multiple thumbs are included, decide whether one component/model covers both or separate surfaces produce clearer types and semantics.

## Menu and toast

### Menu

Required outcome: `bunt-menu` and `bunt-menu-item` provide a menu-button interaction with one tab stop, reliable focus return, arrow/Home/End navigation, typeahead, disabled-item handling and the appropriate plain, checkbox and radio item states. Submenus remain later work.

Candidate direction: use a `popover=auto` surface where it satisfies the contract, with `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio` and separator semantics plus roving tabindex. [Overlay lifecycle](../../overlay-lifecycle/spec.md) owns open state, native event reconciliation, placement policy, dismissal and focus restoration. This family owns menu-specific active-item and action behavior and must verify the complete APG keyboard table.

### Toast

Required outcome: present transient status and error messages without stealing ordinary focus, keep actionable messages available, let users pause dismissal while reading or interacting, and provide a reliable way to reach the toast region without covering the current focus target.

Candidate direction: compare an ordinary toast host with an optional `useToast()` shared workflow under the accepted primed-view model. The earlier candidate uses a persistent dictionary-named `role=region`, `role=status` for ordinary messages, `role=alert` for errors, a `popover=manual` stack, a documented focus hotkey, pause on hover and focus, at least five seconds for automatic dismissal, no automatic dismissal while an action is present, and CSS-controlled corner placement. These details remain candidates until announcement, focus, dismissal and live-presentation evidence settles them.

[Infrastructure and verification](../../infrastructure/spec.md) owns announcer transport, host lifetime, app isolation, disposal and modal reachability. [Initialization and strings](../../app-configuration/spec.md) owns the region name and other built-in strings. [Overlay lifecycle](../../overlay-lifecycle/spec.md) owns native overlay events and presentation changes. This family owns which toast events announce, priority, action behavior and user-facing timing policy.

## Boundaries and sequencing

This record deliberately does not restate the owned designs for [date inputs](date-inputs.md), [select and combobox](../../selection/spec.md), or [tooltip, dialog and popover](../../overlay-lifecycle/spec.md). It also does not define the form wrapper or control connection owned by [validation/forms](../../validation-forms/spec.md) and [field wiring](../../field-wiring/spec.md), or the shared accessibility setup and announcer owned by [infrastructure](../../infrastructure/spec.md). Those records remain the source when a component consumes their decisions.

Independent native control design can proceed once its family is selected. Shipping validation integration waits for the forms and field handoff it consumes. Shipping live CSS presentation waits for evidence from [style observation](../../style-observer/spec.md) where applicable. Menu and toast consume the overlay lifecycle; toast also consumes announcement and app-configuration contracts. A family completes only with its type evidence, all applicable accessibility evidence and integrated checks against the contracts it consumes.
