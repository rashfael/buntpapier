---
status: planned
parent: ../spec.md
activity: design
next: decide the beta boundary, then design locale, draft, range-field and responsive-transition scenarios within that boundary
waiting_on: scope-selection-and-beta-boundary
profile: current owner-selected Codex session; model and effort not exposed
---
# Date-input editing and responsive presentation

## Goal and authority

This work owns the remaining input experience around the accepted date-picker calendar: locale-sensitive single-date editing, editable range endpoints and integration with responsive popup, modal or embedded presentation. The beta quest owns its scope and acceptance. The owner authorized this planning record on 2026-09-19 as part of the date-picker documentation consolidation; no product execution or unresolved behavior was selected.

The [date-picker interaction record](../../../design/date-picker-interaction.md) is the durable baseline. The [date-picker ground-truth record](date-pickers.md) owns the delivered Phase 0 fixes and remaining browser and assistive-technology evidence for that implementation. This work must preserve `Temporal.PlainDate`, nullable range endpoints, the current calendar selection and preset behavior, Alt+Down entry, bare-arrow segment editing, the non-trapping popup and an empty model that stays empty on focus.

## Owned decisions

- Define locale-sensitive display, segment order, parsing and paste behavior for a single date, including application defaults, local locale overrides and changes while an edit is in progress.
- Define two editable range endpoints as one logical field, including drafts, partial values, commit and cancellation, calendar synchronization, endpoint order and focus movement between the two inputs and the shared calendar.
- Define how the editable field and unfinished work survive live switches between embedded, popup and any selected mobile/modal presentation.
- Decide which of these outcomes are required for beta and which remain later work. The beta owner makes that product-scope decision; this record supplies the scenarios and dependency effects.

This work does not reopen the calendar grid, date-limit composition, range-selection or preset contracts unless evidence shows that an input proposal cannot preserve them. It does not design a generic locale parser ahead of the date and number-input requirements. Time picking, timezone-aware values, multiple-date selection and new calendar views are separate products.

## Inherited constraints

Committed models and editing drafts stay distinct. A failed parse must be reportable while the previous committed `PlainDate` or `DateRange` remains intact. Calendar selection can update a committed value, but presentation changes must not invent, discard or silently commit a draft. Reset, external model updates and locale changes need explicit conflict rules.

Locale is application configuration with a reactive per-component override. Presentation policy belongs in CSS and applies live; JavaScript applies the corresponding native behavior. These accepted boundaries do not decide exact locale fallbacks, token names, native transitions or focus targets.

The single date remains one native text input unless evidence establishes that locale-sensitive editing cannot meet the required keyboard, mobile and assistive-technology scenarios. The two range endpoints may be separate native inputs inside one logical field and visual outline. That is the leading direction, not an adopted contract.

Forms and observer work stay deferred. This spec may state the date control's required draft, focus and parse signals, but it must not select the public form authoring API, validation engine, field binding syntax or style-observer implementation.

## Integration boundaries

| dependency | owning scope | what date inputs need from it | what this work supplies |
|---|---|---|---|
| Locale and built-in strings | [Initialization and strings](../../app-configuration/spec.md) | Reactive app locale, local override precedence, SSR/hydration fallback and localized built-in labels | Date-formatting and parsing scenarios, required string meanings and behavior when locale changes mid-draft |
| Logical field and DOM wiring | [Field wiring](../../field-wiring/spec.md) | One logical name, label, descriptions, attributes, readonly behavior, focus attachment, clear-action policy and the future outline treatment | Endpoint structure, draft/parse state, preferred focus targets and popup/embedded attachment cases |
| Form and validation behavior | [Validation and forms](../../validation-forms/spec.md) | Reset, external updates, parse-error reporting, validation participation and submission behavior | A distinction between committed value, one or two drafts and parse results; date-specific reset and invalid-draft scenarios |
| Overlay lifecycle | [Overlay lifecycle](../../overlay-lifecycle/spec.md) | Native transition, dismissal and focus rules for live popup/modal/embedded changes | The open-calendar scenario, unfinished range state and usable date-field/calendar focus targets before and after a transition |
| Presentation observation | [Style observer](../../style-observer/spec.md) | Eventual detection of resolved behavior-affecting CSS changes | Required observable presentation changes and state that must survive them; no observer design |
| Shared accessibility support | [Infrastructure](../../infrastructure/spec.md) | Announcement service and shared focus/visually-hidden styles | Date and range announcement policy and modal-context cases after the interaction is decided |

The number input may face related locale parsing questions. Share a primitive only after both contracts expose the same responsibility and edge cases; similar use of `Intl` alone is not enough.

## Required scenarios

### Locale and editing

- Start empty and enter a complete date in at least DMY, MDY and YMD locales. The expected visible order, separators, segment selection and committed `PlainDate` are explicit.
- Paste a locale-formatted value, canonical ISO value and invalid text. Decide which formats the default parser accepts, when `parseInput` takes over and whether a valid paste commits immediately.
- Switch the application locale and a local override while blurred, while a valid draft is active and while an invalid or partial draft is active. Preserve the committed date and define whether the draft is reformatted, retained or cancelled.
- Exercise native select-all, copy, cut, paste, undo, Backspace, Delete, Home and End alongside locale-sensitive segment keys on desktop and a numeric software keyboard on touch devices.
- Apply `minDate`, `maxDate` and `disabledDates` through typing, paste and segment changes as well as through the calendar.

### Draft and range model

- Represent empty, start-only, end-only, same-day, forward and reverse range entry without conflating a temporary endpoint draft with the committed `DateRange`.
- Move between start and end inputs, the shared calendar and outside content by pointer, Tab, Shift+Tab and Alt+Down. Define which endpoint the calendar edits and how that is announced.
- Enter invalid or disallowed text in either endpoint, then press Enter, Escape, blur inside the logical field, blur outside it, clear, reset and receive an external model update. State what commits, reverts or stays available for repair.
- Choose one or two calendar days while one endpoint has a draft. Define ordering, replacement and whether calendar selection commits immediately or first updates an endpoint draft.
- Keep the popup open while moving between the two range inputs. Leaving the logical field closes it and cancels only the state that the contract identifies as provisional.

### Responsive presentation and focus

- Change from popup to embedded or modal presentation and back while closed, while the input has a draft, while a calendar day has focus and after the first range endpoint is selected.
- Preserve committed data, drafts, visible month, focused/active day and unfinished range state according to their owners. Define a usable destination when the previous focused element disappears.
- Cover coarse pointers, narrow viewports, a tablet with a hardware keyboard, the on-screen keyboard covering content, safe areas, scroll containment, dismissal and focus restoration. Pointer type or viewport width may inform CSS but does not by itself select the policy.
- Keep text editing available if a mobile/modal presentation is selected. The old full-screen calendar-with-input proposal is a candidate to test, not accepted behavior.

### Accessibility and integration

- Give the single input and two-input range one stable logical name, usable descriptions and consistent readonly/disabled behavior in every presentation.
- Verify the combobox/dialog relationship, endpoint naming, current endpoint, invalid drafts, range-step announcements and month announcements without duplicate speech.
- Verify keyboard behavior against the published table, touch and software-keyboard behavior, zoom and reflow, high contrast, reduced motion, NVDA with Firefox and VoiceOver with Safari. Automated role and axe checks support but do not replace those observations.
- Exercise native form submission or its selected replacement, reset, requiredness and error focus only after the field/forms contracts define them. An embedded calendar without a textbox must still represent one logical field.

## Questions

| shortname | question | resolution | dependency |
|---|---|---|---|
| `beta-cut` | Which locale, range-editing and responsive outcomes are required for beta, and which can ship later? | decide | Beta owner; blocks delivery acceptance and sequencing |
| `locale-display` | Which locale-derived order, separators and blurred/focused representations are the default? | research, decide | App locale contract and supported browser/Intl behavior |
| `parse-contract` | Which default typed and pasted forms are accepted, how does `parseInput` override them, and when does a parse commit? | decide, prototype | `locale-display`; coordinate with number input only after concrete overlap |
| `locale-change` | What happens to valid, invalid and partial drafts when the effective locale changes? | decide, prototype | App-configuration update and override semantics |
| `range-drafts` | How are two endpoint drafts ordered, committed, cancelled, reset and reconciled with external model changes and calendar selection? | decide, prototype | Forms draft/reset behavior and current range-selection contract |
| `range-focus` | How do the two inputs, clear action and shared calendar form one Tab sequence and one accessible field? | decide, prototype | Field DOM/focus contract and overlay focus rules |
| `responsive-mode` | Which presentations are supported at beta, how are they selected in CSS, and what native transition carries an open workflow between them? | decide, prototype | Overlay policy/tokens and eventual observer evidence |
| `mobile-editing` | Does the candidate modal-with-editable-field work with software keyboards, safe areas, scrolling and assistive technology? | prototype | `responsive-mode`; representative mobile browser access |
| `announcements` | What must be announced for endpoint editing, parse errors, calendar selection and mode changes without duplicating month output? | decide, prototype | Infrastructure announcement service and field feedback policy |
| `form-handoff` | Which date-specific value, draft, parse and focus signals must field wiring expose without selecting the deferred public form API? | decide | Forms responsibilities and field-connection boundary |

## Acceptance and evidence

Design is ready for beta scoping when the `beta-cut` decision maps every owned outcome to beta or later, the scenario set above has a written expected result, and every dependency has a named handoff rather than an assumed implementation. Consequential accepted behavior moves into the date-picker interaction record and the relevant shared contract.

Delivery is ready for acceptance only after the selected single-date, range and responsive scenarios have criterion-to-test evidence, integrated field/overlay/configuration checks pass, and required manual browser and assistive-technology observations are recorded against a named revision. WebKit and mobile evidence cannot be inferred from Chromium or Firefox. Form submission, reset and error-focus evidence remains blocked until its owning contracts are resumed and selected.

## Outside this work

Additional picker products and customization ideas belong to the [single backlog](../../../TODOs.md#further-date-picker-candidates). This work keeps the existing calendar baseline and owns only the selected editing/presentation outcomes and their integration.
