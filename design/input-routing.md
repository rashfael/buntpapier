# Input routing

This is the attribute, event and focus contract for input, checkbox, select and both date pickers. Input, checkbox, select and both date pickers implement it. Chromium and Firefox contract checks cover those implementations, including source SSR/hydration. WebKit, manual screen-reader observations and published declaration checks remain outstanding.

The supported `bunt-input` types are `text`, `search`, `email`, `url`, `tel`, `password` and `number`. The owner adopted this boundary on 2026-09-20: dedicated components own date/time and other specialized interactions. The former arbitrary native type surface cannot satisfy the focusable readonly/disabled contract across browsers.

## Attribute targets

The control is the element the component's label names: the native input or checkbox, the textbox in select and popup pickers, or the calendar group in embedded pickers. The component is the whole Vue component, including its labels, actions and owned popups. Embedded pickers attach native listeners to the calendar container; event targets remain the actual day or navigation buttons.

| Declaration | Target |
|---|---|
| `class`, `style`, `data-*` | Component root |
| `lang`, `dir`, `hidden`, `inert`, `title` | Component root, covering labels, actions and owned popups; teleported content needs equivalent treatment |
| `id` | Control; never duplicated on the root or a day |
| `name`, `form` | Applicable native control; no hidden serialization inputs or composite-value submission contract |
| `autocomplete`, `inputmode`, `maxlength` and other native attributes | Control where applicable; text-input attributes have no effect on embedded calendars |
| `tabindex` | Control; embedded calendars preserve their keyboard navigation without assigning every day a tab stop |
| `aria-label`, `aria-labelledby`, `aria-describedby` | Control |
| Other undeclared attributes | Control where meaningful, without a second copy on the root |

Bindings update on subsequent renders. Native attribute support follows the target element. The component owns its required role, expanded/controls relationships and model-derived state; contradictory attributes cannot override them. Application state uses the supported props.

Caller ids take precedence. Otherwise, each instance generates a stable unique id, with derived label and description ids. The current contract assumes one Vue application per document: generated ids remain consistent through SSR/hydration and unique among its component instances. Coordination between applications is deferred. Changing a caller id updates internal references together.

Accessible naming uses `aria-labelledby`, then `aria-label`, then the component label. The visible label remains rendered. Consumer description ids merge with internal guidance/feedback ids without duplicates. Compound components also expose state on the elements required by their roles.

Forms follow the [SPA submission contract](api-guide.md#spa-submission). An external `label(for="id")` targets a labelable native control. Embedded calendars use a named group and programmatic focus.

## Events

| Event | Meaning |
|---|---|
| `update:modelValue` | Typed value update; parsing and commit timing belong to the component |
| `input`, `change` | Actual native control events, forwarded once with the original event object |
| `focus`, `blur` | Entering or leaving the whole component, including actions and owned popups; no payload |
| Other native listeners | Attached once to the control, or to the calendar container when embedded, preserving event targets and Vue modifiers |

Calendar selections and clear actions update the model without fabricating text-input events. A select search edit can emit `input` without committing an option. Embedded calendars have no text-input events.

Internal focus movement produces no extra `focus`/`blur` pair. Disabling a component preserves focus within it. Losing focus because a mounted component becomes hidden or inert counts as leaving; unmount cleanup emits no callback. These notifications describe focus, without establishing touched/dirty state or validation timing.

Raw `focusin`/`focusout`, click, keyboard, pointer and composition listeners use the documented native target. A separate clear button does not invoke the textbox's click listener. Application wrappers handle container-wide events. Internal editing and keyboard behavior remains active.

## Programmatic focus

Every component exposes `focus(options?: FocusOptions): void`. It focuses the control without opening its popup merely because focus was requested. An enabled embedded picker focuses the day holding the calendar's tab stop, with a usable calendar fallback when no day can receive focus. Disabled components use the targets below. Hidden, inert or unmounted components do nothing. Existing exposed `el` references identify the component root.

## Disabled controls

Disabled components have one focus target in the Tab sequence, with a visible focus indicator. Caller `tabindex="-1"` removes that target from Tab order; `focus()` still reaches it. Disabled takes precedence over readonly. Ordinary text selection and copying remain available where the native control supports them.

| Component | Disabled focus target | Blocked operations |
|---|---|---|
| Text input | Native input | Editing |
| Checkbox | Native checkbox | Toggling through the checkbox, label or keyboard |
| Select | Textbox | Typing, opening, option navigation and selection |
| Popup date/range picker | Display textbox | Editing, opening, date changes, presets and clearing |
| Embedded date/range picker | Named calendar group | Day selection, month navigation, presets and clearing; internal buttons leave the Tab sequence |

The target exposes `aria-disabled="true"`; component guards prevent operation. Text controls use native `readonly` where applicable. Internal buttons can use native `disabled`. The disabled state does not cover help links in surrounding guidance, and the component root does not use `inert` or suppress pointer events.

Disabling closes an open popup without committing pending input. Focus inside the popup or an unavailable action moves to the control; focus elsewhere stays where it is. Text drafts survive until re-enabled unless an application model update supersedes them; unfinished range selection is cancelled. Disabling emits no model update. Re-enabling does not reopen the popup. Tab leaves normally; Enter on a disabled control cannot trigger implicit submission.

Supplied tooltips open on trigger hover and keyboard focus, dismiss with Escape and describe the focus target through merged `aria-describedby` ids. Ordinary explanations close on pointer leave or keyboard blur and dismiss on trigger activation; mouse-acquired focus does not pin them open. Escape keeps the explanation dismissed until a new interaction. Tooltip pixels ignore pointer events and remain unselectable, preserving clicks to the underlying element without activating the tooltip's owner. Input, select and both date pickers use labels, placeholders and hints for field content; they have no tooltip prop or internal tooltip integration. Checkbox has neither a tooltip integration nor a hint surface; caller descriptions explain its unavailability. A calendar day's disabled reason stays an inline `v-tooltip` on that day and never joins the control's description. Inline DOM elements support `v-tooltip="explanation"` through an adapter using the same composable. Hints or caller descriptions can explain unavailability. Native `title` or a hidden compact hint alone does not provide the required keyboard explanation.

The owner approved this interim compatibility contract on 2026-09-21. Persistence while the pointer travels onto or hovers tooltip content is deferred, including any geometry-tracking implementation. The custom tooltip does not inherit the native user-agent tooltip exemption, so the interim contract does not claim full SC 1.4.13 conformance. Forced error feedback remains visible without hover/focus until cleared or explicitly dismissed; unrelated rerenders do not reopen it, while a new error may.

## Rationale

The root carries component styling; the control receives input behavior. Root-only forwarding loses native input semantics, while control-only forwarding moves styling and component selectors onto an internal element. Explicit routing avoids a second public API of attribute bags.

Whole-component focus notifications let callers detect departure without knowing the popup structure. They require focus tracking, including teleported content; native control transitions remain available through `focusin`/`focusout`.

## Implementation

`src/utils/field.ts` shares current attribute routing, generated ids and focus ownership between input, checkbox, select and both date pickers. Routing reads caller bindings during rendering. Focus tracking includes the owned popup, silently cleans up on unmount and checks availability while focused so hidden or inert ancestors count as departure. The select keeps one native textbox and an element root containing its teleport declaration. Programmatic focus suppresses focus-triggered popup opening.

The checkbox keeps its native checkbox inside the component's label and names it through `aria-labelledby` on the rendered label content. Its disabled state cancels the checkbox's click, which pointer, label, Space and scripted `click()` activation all dispatch, so the checked state is restored and no `input` or `change` event fires; a keydown guard blocks Enter's implicit submission, which Chromium and Firefox both perform from a checkbox. The visually hidden checkbox shows keyboard focus on its box.

The pickers pass the control that matches their presentation: the display textbox in popup mode, and `CalendarPanel`'s named group when embedded. Public focus prefers the day holding the calendar's tab stop and falls back to that group; a caller `tabindex` lands on the group, and a negative one takes the days out of the Tab sequence instead of giving every day a tab stop. The same reconcile loop repairs focus when an element inside the component stops being rendered, which is what keeps a focused clear action from stranding focus when `--input-clear` hides it: Chromium leaves `document.activeElement` on the hidden button and Firefox drops focus to the body, and neither fires a usable event.

`--input-clear` is applied entirely in CSS. `src/styles/components/date-picker.sass` hides the action under `@container style(--input-clear: none)`, so the token inherits, updates live and resolves unset, empty and unsupported values back to `auto` without any JavaScript read. The fallback chain deliberately declares no default for it: an own declaration on the component root would shadow what an ancestor inherits.

The tooltip directive associates descriptions with the actual control and observes description changes. Escape dismissal applies while the explanation is visible, including when keyboard focus is elsewhere. The approved compatibility repair removes the pointer-receiving bridge across the positioning gap; tooltip hover persistence remains deferred.

Permanent consumer coverage lives in `tests/components/field-contracts.test.ts`, `field-boundaries.test.ts`, `select-groups.test.ts`, `picker-contracts.test.ts` and `checkbox-contracts.test.ts`. `tests/fixtures/SsrFields.vue`, `SsrPickers.vue` and `SsrCheckboxes.vue` cover source SSR/hydration; `FieldApiCases.vue` supplies source API cases for the separate declaration checks. Passing browser consumers does not establish published type compatibility or manual assistive-technology behavior.
