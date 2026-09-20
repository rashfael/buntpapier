# Date-picker interaction

## Current contract

`bunt-date-picker` selects a `Temporal.PlainDate | null`. `bunt-date-range-picker` selects `{ start, end }`, with either endpoint nullable. `PlainDate` is deliberately timezone-free: it represents a calendar date rather than an instant. The components import Temporal from `@js-temporal/polyfill`; they do not depend on `globalThis.Temporal`. Time, timezone-aware values and multiple independent dates require separate selection models.

Both pickers share the calendar grid and navigation in `CalendarPanel.vue` and `CalendarMonth.vue`. The single-date calendar starts from its selected date or today's month. The range calendar starts from its selected start date or today's month; an end-only range therefore starts at today's month. Each calendar renders complete week rows from the week containing the first day through the week containing the last day, and can show one or more consecutive months. Week starts come from the explicit `weekStartsOn` value or the locale, with Monday as the fallback. Month names, full day labels and week starts use the component locale. Week numbers are ISO week numbers.

`minDate`, `maxDate` and `disabledDates` compose into one availability check for a candidate date. A callback may return a disabled reason. Disabled dates stay focusable so a user can inspect them. Every single-date commit path checks the candidate, and range selection checks each endpoint. A range may currently enclose a date rejected by `disabledDates`; whether interior dates invalidate a range is unresolved. Adjacent-month days remain selectable; `navigateOnOutsideDayClick` controls whether selecting one also moves the visible month.

Popup and inline presentations use the same calendar behavior. The current API exposes `inline`, `monthsToShow`, `showWeekNumbers` and `clearable` props. The accepted future API moves presentation choice, visible month count, week-number visibility and clear-control visibility to CSS while keeping allowed values and application state in props. That migration has not happened. Presentation changes must preserve the selected value, draft and usable focus target; the field and overlay contracts own the remaining mechanics.

### Single date

The popup input displays the committed value as `YYYY-MM-DD`, including while blurred. The default parser accepts that ISO form and dotted day-month-year input. Applications can replace parsing through `parseInput`. Free typing updates an editing draft and moves the calendar when the draft parses, but commits only on Enter or blur. A valid and allowed pasted date commits immediately. Empty text commits `null`; syntactically invalid text is marked invalid while editing. Invalid and disallowed drafts both revert to the last committed value on Enter or blur. Escape discards the draft.

Canonical ISO values support segmented editing inside one native text input. Left and Right move between year, month and day, Up and Down change the selected segment, and digit input can replace a segment. Native select-all, copy, paste, cut and undo remain input operations. Segment changes respect all date limits. Locale-sensitive segment order and display are not implemented.

Pointer activation opens the popup and keeps focus in the input. Keyboard focus alone does not open it. Alt+Down opens the popup and moves focus to the remembered calendar day. Bare Up and Down remain segment-editing keys; they do not open the calendar. Opening an empty picker does not commit today.

Selecting a day or preset commits immediately, closes a popup and restores input focus. Inline selection commits without closing. A clear action emits `null` when it is present. The built-in single-date presets resolve Today and Yesterday when activated.

### Date range

The current range textbox is readonly. Calendar selection starts with one endpoint, previews the ordered range while the pointer or keyboard moves, then commits an ordered inclusive pair on the second selection. Escape, focus leaving the picker or popup dismissal cancels an unfinished range without changing the committed model. Selecting a preset commits its pair immediately; clearing emits two null endpoints.

The default compact display distinguishes an empty range, either single endpoint, a same-day range, and ranges within one month, year or multiple years. `formatRange` can replace that display. Editing two endpoints and representing their drafts remain planned work.

Preset factories calculate their values when activated. Omitting `presets` omits the preset area. The regular range endpoints are inclusive:

| preset | start | end |
|---|---|---|
| Today | today | today |
| Yesterday | yesterday | yesterday |
| Last 7 days | today minus 6 days | today |
| Last 14 days | today minus 13 days | today |
| Last 30 days | today minus 29 days | today |
| This month | first day of this month | today |
| Last month | first day of last month | last day of last month |

The analytics factory's `excludeCurrentPeriod` branch keeps its existing calculations:

| preset | start | end |
|---|---|---|
| Today | today | today plus 1 day |
| Yesterday | yesterday | yesterday plus 1 day |
| Previous week | start of this week minus 1 week | start of this week minus 1 day |
| Previous 4 weeks | start of this week minus 4 weeks | end of this week minus 1 week |
| Previous month | first day of last month | last day of last month |

These values are current compatibility behavior; changing their interval convention requires an explicit API decision.

## Current implementation limits

A syntactically valid but disallowed single-date draft moves the visible calendar and is not exposed as invalid while editing, even though Enter and blur refuse to commit it. The future draft and validation contract must decide whether that state is invalid, unavailable or merely uncommittable.

Range day selection and range presets reject disabled endpoints, but they do not inspect dates between the endpoints. The current result can therefore enclose a callback-disabled date. This record does not invent an interior-date rule; changing the behavior requires an explicit range-availability decision and regression cases for calendar and preset paths.

## Focus and accessibility

The popup is a non-modal native popover with `role="dialog"`. It does not trap focus. Pointer opening leaves focus in the editable or readonly input; Alt+Down enters the calendar. Tab follows DOM order through the input, optional clear action, previous and next month actions, one remembered day in each visible month and presets. Moving focus beyond the picker closes it. Escape from the popup closes it, cancels an unfinished range and restores input focus.

Each month is an ARIA grid with a unique label. Rows, column headers and optional week-number row headers expose their corresponding roles. Selection belongs to the gridcell; its day button supplies the full localized date name, current-date state and disabled state. One roving tab stop is remembered per visible month. Arrow keys move by a day or week, Home and End move to the start or end of the current week, PageUp and PageDown move by a month, and their Shift variants move by a year. Enter and Space select an available day. Movement across a visible boundary changes the displayed month and keeps focus on the destination.

A single polite live region announces the visible month range. The range picker uses a separate status region after the first endpoint so the month is not announced twice. Popup and grid IDs are unique per component instance. Built-in labels and announcements are still hardcoded in English; the application strings contract owns their replacement.

The popup deliberately calls `showPopover()` without a `source` argument. Firefox 148 repeated a source-linked popup in the Tab sequence, so entry and return stay explicit. A modal dialog and focus trap would also prevent pointer-opened users from continuing to edit the input. Responsive modal behavior remains an open design question rather than current behavior.

## Accepted rationale and alternatives

| alternative | outcome | reason |
|---|---|---|
| Display-only input with an explicit calendar trigger | Rejected | It makes the calendar the only date-entry path. Typing is a core requirement, including for users who can enter a known date faster than they can navigate a calendar. |
| Individually focusable contenteditable segments | Rejected in favor of one native text input with controlled selection ranges | Separate segments need custom copy, paste, select-all, caret and undo behavior and create several Tab stops for one logical value. The native input keeps those text operations and one field while still supporting segment movement. |
| Free-text input whose popup opens on click but not keyboard focus, the earlier Model C2 | Retained as the fallback if reliable segment selection, paste handling or cross-browser input behavior makes controlled segments too costly | It preserves the central typing and non-modal popup behavior, but loses precise arrow-key segment editing. It is a fallback, not the current implementation. |
| One free-text range string | Rejected for the current range control; two editable endpoint inputs remain the leading future direction | A combined string makes the separator, partial endpoints, active endpoint, ordering and repair state ambiguous. Two logical inputs can share one field outline and calendar while giving each endpoint its own draft and accessible name. |

The selected single-date input therefore uses a native `<input type="text">` with controlled selection ranges. This preserves one logical field, one Tab stop and native text operations while providing segment navigation. Free text remains available because the calendar is an aid rather than the only control.

The earlier input-only calendar proposal is superseded. Keyboard users can enter the calendar with Alt+Down and reach its controls through Tab. The earlier focus trap, focus-commits-today behavior and bare-Down opening rule are also superseded by the current contract.

The component docs carry the public keyboard tables. This record owns the interaction rationale and current cross-component invariants. Locale-sensitive editing, editable range fields and responsive presentation are one planned beta work area; they must preserve the calendar contract above instead of redefining it incidentally.

## Verification

The [single-picker suite](../tests/components/date-picker.test.ts), [range-picker suite](../tests/components/date-range-picker.test.ts) and [fixture](../tests/fixtures/DatePickers.vue) cover the current regression scenarios:

- Empty focus and opening, pointer and Alt+Down entry, focus return, outside-focus dismissal and Escape cancellation.
- Single-date free text, ISO segment movement and replacement, invalid drafts, clearing and model values.
- Ordered range selection in both directions, live preview, cancellation, presets and clearing.
- Day, week, month and year grid movement; Space and Enter selection; Tab order through one or two months and presets.
- Single-date limits, disabled-date inspection, bounded month navigation, adjacent-month selection, inline mode and week numbers.
- Grid roles, unique IDs, selected gridcells, current-date state, range announcements and runtime-error checks.

The fixed-date Playwright clock must keep advancing because freezing `Date.now()` breaks Vue's bubbling-event timestamp guard. The 2026-09-17 delivery recorded 37 passing tests in Chromium and Firefox plus passing library and docs builds. WebKit CI, axe coverage and manual NVDA/Firefox and VoiceOver/Safari checks remain required evidence; the passing suites do not establish full accessibility conformance.

Dedicated regression evidence is still missing for the valid-paste path, a custom `parseInput`, built-in preset calculations, multiple locale-derived month/week layouts, `navigateOnOutsideDayClick: false` and disabled-reason output. These remain current-behavior checks even where later locale work will broaden them.

## Sources

The design was informed by the [W3C APG date-picker combobox example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/), [USWDS date-picker guidance](https://designsystem.digital.gov/components/date-picker/), [Adobe React Aria's date and time picker rationale](https://react-aria.adobe.com/blog/date-and-time-pickers-for-all), [Shopify DateField](https://shopify.dev/docs/api/app-home/web-components/forms/date-field), [MUI picker concepts](https://mui.com/x/react-date-pickers/base-concepts/), [Ant Design DatePicker](https://ant.design/components/date-picker/) and [Material 3 date-picker guidance](https://m3.material.io/components/date-pickers/guidelines). Those systems do not share one opening or editing model; the decisions above are Buntpapier's contract.
