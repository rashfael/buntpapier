# Date Picker Component Spec

## Overview

Two Vue 3 components for date selection with a shared core:

- **`DatePicker`** — selects a single `Temporal.PlainDate`
- **`DateRangePicker`** — selects a `{ start, end }` pair of `Temporal.PlainDate`

Both are built on a shared internal `CalendarMonth` component and a `~/lib/temporal` utility module. Both support `inline` rendering (no input/popover wrapper) for embedding directly in UI.

---

## Package

Add `@js-temporal/polyfill`. Import `Temporal` from `@js-temporal/polyfill` everywhere — do not rely on `globalThis.Temporal`.

---

## Design note: no timezone prop

`Temporal.PlainDate` is explicitly timezone-agnostic — it represents a calendar date ("March 5, 2025") with no time or timezone attached. There is no "date shifting" across timezone boundaries, which is the exact problem that plagues JS `Date`-based pickers. This is a deliberate choice. If timezone-aware instants are needed, that is the `ZonedDateTime` future improvement (a separate component variant).

---

## `~/lib/temporal.ts`

Shared module (no Vue dependencies). Exports everything date-related:

```ts
import { Temporal } from '@js-temporal/polyfill'

export { Temporal }

export interface DateRange {
  start: Temporal.PlainDate | null
  end: Temporal.PlainDate | null
}

// Calendar helpers
export type WeekStart = 'monday' | 'sunday'

export function startOfWeek (d: Temporal.PlainDate, weekStartsOn?: WeekStart): Temporal.PlainDate
// ISO dayOfWeek: Mon=1 … Sun=7
// monday: d.subtract({ days: d.dayOfWeek - 1 })
// sunday: d.subtract({ days: d.dayOfWeek % 7 })

export function endOfWeek (d: Temporal.PlainDate, weekStartsOn?: WeekStart): Temporal.PlainDate
// monday: d.add({ days: 7 - d.dayOfWeek })
// sunday: d.add({ days: 6 - (d.dayOfWeek % 7) })

export function startOfMonth (d: Temporal.PlainDate): Temporal.PlainDate
// d.with({ day: 1 })

export function endOfMonth (d: Temporal.PlainDate): Temporal.PlainDate
// d.with({ day: d.daysInMonth })

export function getLocaleWeekStart (locale?: string): WeekStart
// Uses Intl.Locale(locale ?? navigator.language).weekInfo if available, falls back to 'monday'

// Formatting — all accept optional locale string passed to Intl
export function formatD (d: Temporal.PlainDate): string                       // "05."
export function formatDM (d: Temporal.PlainDate): string                      // "05. 03."
export function formatDMY (d: Temporal.PlainDate): string                     // "05. 03. 2025"
export function formatMY (d: Temporal.PlainDate, locale?: string): string     // "March 2025" via Intl

// formatD / formatDM / formatDMY use zero-padded string templates, no Intl needed
// formatMY: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })

// Week number (ISO)
export function isoWeekNumber (d: Temporal.PlainDate): number
// Temporal.PlainDate.weekOfYear with ISO calendar

// Comparison shorthands
export function sameDay (a: Temporal.PlainDate, b: Temporal.PlainDate): boolean
export function sameMonth (a: Temporal.PlainDate, b: Temporal.PlainDate): boolean
export function sameYear (a: Temporal.PlainDate, b: Temporal.PlainDate): boolean

// Preset factories
export interface DatePreset<T> {
  label: string
  getValue: () => T
}

export function defaultDateRangePresets (opts?: {
  excludeCurrentPeriod?: boolean  // shifts all ranges to exclude today (analytics use case)
}): DatePreset<DateRange>[]

export function defaultDatePresets (): DatePreset<Temporal.PlainDate>[]
```

---

## Accessibility requirements

Accessibility is a first-class requirement, not an afterthought. The implementation follows the [W3C ARIA Date Picker Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/).

### Popover / dialog (input mode)
- The popover has `role="dialog"` with `aria-label="Choose date"` (or `"Choose date range"`)
- **Focus trap**: Tab and Shift+Tab cycle through focusable elements within the open popover and do not escape to the page behind
- Escape closes the popover and returns focus to the input

### Calendar grid
- Calendar body: `role="grid"` with `aria-label` naming the displayed month(s)
- Each row: `role="row"`
- Day cells: `role="gridcell"` with:
  - `aria-label`: full date e.g. `"Wednesday, March 5, 2025"` via `Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })`
  - `aria-selected="true"` when selected or in-range
  - `aria-disabled="true"` when disabled
- Week number cells (when shown): `role="rowheader"`, not interactive, `aria-label="Week {n}"`
- Day-of-week header cells: `role="columnheader"` with full weekday name in `aria-label` (e.g. `aria-label="Monday"`) even though visible text is just "M"

### Keyboard navigation (roving tabindex within the grid)

Only the focused cell has `tabindex="0"`; all others `tabindex="-1"`. Navigating across month boundaries auto-advances the view.

| Key | Action |
|---|---|
| Arrow keys | Move focus one day in that direction |
| PageUp / PageDown | Move focus one month back / forward |
| Shift+PageUp / Shift+PageDown | Move focus one year back / forward |
| Enter / Space | Select focused day |
| Home / End | Jump to first / last day of the current week row |

### Live region
A visually hidden `aria-live="polite"` region announces the month name whenever the view changes (nav or on open). Screen reader users hear "March 2025" without having to navigate to the header.

### Nav buttons
- `aria-label="Previous month"` / `"Next month"`
- `aria-disabled="true"` (not `disabled`) when at a boundary, so focus can still land on them

---

## Internal `CalendarMonth.vue`

Renders a single month grid. Computes its own day grid from `month`; all day classification is delegated to function props from the parent picker.

```ts
defineProps<{
  month: Temporal.PlainDate                            // which month to display
  weekStartsOn: WeekStart                              // passed down from parent
  showWeekNumbers: boolean                             // passed down from parent
  locale?: string                                      // for month name and aria-label formatting
  isDayDisabled: (d: Temporal.PlainDate) => boolean
  isDayInRange?: (d: Temporal.PlainDate) => boolean    // undefined → no range highlight
  isDayRangeStart?: (d: Temporal.PlainDate) => boolean
  isDayRangeEnd?: (d: Temporal.PlainDate) => boolean
  isSelected?: (d: Temporal.PlainDate) => boolean      // for single picker
}>()

defineEmits<{
  'day-click': [day: Temporal.PlainDate]
  'day-hover': [day: Temporal.PlainDate]
}>()
```

Internally calls `generateCalendar(month, weekStartsOn)` to produce the day cells: a grid aligned to the configured start day that begins on or before the 1st of the month and ends on or after the last day of the month. The grid is always 35 or 42 cells. Padding days from the previous or next month fill the rectangle; they are rendered with the `other-month` class and are still clickable.

The day-of-week header row matches `weekStartsOn`: `['M', 'T', 'W', 'T', 'F', 'S', 'S']` for Monday, `['S', 'M', 'T', 'W', 'T', 'F', 'S']` for Sunday. Each header cell carries a full `aria-label` (see Accessibility section).

When `showWeekNumbers` is true, an extra column is prepended: a `role="rowheader"` header cell and per-row week number cells. Not interactive.

CSS classes applied per day cell: `other-month`, `today`, `disabled`, `selected`, `in-range`, `range-start`, `range-end`.

Template renders:
- Month title via `formatMY(month, locale)`
- Day-of-week header row (7 or 8 columns)
- Grid of day cells (35 or 42 cells) with roving tabindex per the Accessibility section

---

## Shared props (both pickers)

```ts
{
  modelValue?: ...                  // type differs per component
  placeholder?: string              // shown in input when no value; ignored in inline mode
  disabled?: boolean
  label?: string                    // input label; ignored in inline mode
  name?: string                     // input name attr; ignored in inline mode
  minDate?: Temporal.PlainDate      // days before this are disabled
  maxDate?: Temporal.PlainDate      // days after this are disabled
  disabledDates?: (d: Temporal.PlainDate) => boolean | { disabled: boolean; reason?: string }  // reason shown as tooltip on disabled cells
  monthsToShow?: number             // default: 1 (DatePicker), 2 (DateRangePicker)
  weekStartsOn?: WeekStart          // default: derived from locale via getLocaleWeekStart(locale)
  locale?: string                   // BCP 47 tag e.g. 'de', 'en-US'; defaults to navigator.language
  showWeekNumbers?: boolean         // default: false
  clearable?: boolean               // default: false — show × to clear value
  inline?: boolean                  // default: false — render calendar directly, no input/popover
  navigateOnOutsideDayClick?: boolean  // default: true — clicking an adjacent-month day advances/retreats the view
  presets?: DatePreset<...>[]       // if omitted, no preset sidebar is rendered
}
```

### `isDayDisabled` composition

```
disabledDatesResult = disabledDates?.(d)
isDisabledByCallback = disabledDatesResult === true
  || (typeof disabledDatesResult === 'object' && disabledDatesResult.disabled)

disabled if:
  Temporal.PlainDate.compare(d, minDate) < 0   (when minDate set)
  || Temporal.PlainDate.compare(d, maxDate) > 0  (when maxDate set)
  || isDisabledByCallback
```

When `disabledDates` returns `{ disabled: true, reason }`, the `reason` string is rendered as a `title` attribute (or tooltip) on the day cell.

---

## `DatePicker.vue`

### Props

```ts
defineProps<{
  modelValue?: Temporal.PlainDate | null
  presets?: DatePreset<Temporal.PlainDate>[]
  // + all shared props
}>()
```

### Emits

```ts
defineEmits<{
  'update:modelValue': [value: Temporal.PlainDate | null]
}>()
```

### Behavior

- Clicking a non-disabled day emits `update:modelValue` and closes the popover (or does nothing extra in inline mode)
- Single click confirms — no two-step selection
- `clearable`: in input mode, shows × in the input field; clicking emits `null`. In inline mode, shows a "Clear" button below the calendar.
- Initial `currentMonth` defaults to `modelValue`'s month if set, otherwise current month

### Additional props

```ts
formatValue?: (d: Temporal.PlainDate) => string              // override the input display string
parseInput?: (text: string) => Temporal.PlainDate | null     // override input parsing
```

### Display value (input mode only)

- Empty string when `modelValue` is null
- `formatValue(modelValue)` if prop provided, otherwise `formatDMY(modelValue)`

---

## `DateRangePicker.vue`

### Props

```ts
defineProps<{
  modelValue?: DateRange
  presets?: DatePreset<DateRange>[]
  // + all shared props (monthsToShow default: 2)
}>()
```

### Emits

```ts
defineEmits<{
  'update:modelValue': [value: DateRange]
}>()
```

### Selection state machine

1. First click: sets `anchor = day`, enters selecting mode
2. Hover while selecting: updates `focus = day` (live range preview)
3. Second click: sorts anchor/focus into `{ start, end }`, emits, exits selecting mode

The preview range (`orderedRangeSelection`) is derived from `{ anchor, focus }` sorted by date and takes visual priority over the committed `modelValue` while selecting.

`clearable`: in input mode, shows × in the input field when at least one bound is set; clicking emits `{ start: null, end: null }`. In inline mode, shows a "Clear" button.

### Additional prop

```ts
formatRange?: (r: DateRange) => string  // override the entire input display string
```

### Display value (input mode only)

If `formatRange` is provided, it takes full control. Otherwise the default formatting:

| State | Display |
|---|---|
| Both null | `''` |
| start only | `formatDMY(start)` |
| end only | `Until ${formatDMY(end)}` |
| same day | `formatDMY(start)` |
| same month | `${formatD(start)} - ${formatDMY(end)}` |
| same year | `${formatDM(start)} - ${formatDMY(end)}` |
| different year | `${formatDMY(start)} - ${formatDMY(end)}` |

### Navigation

`goToPrevMonth` / `goToNextMonth` shift `currentMonth` by one month. The next button is disabled when `maxDate` is set and `maxDate`'s month is already visible as the last calendar panel.

### Popover (input mode only)

Uses the native Popover API (`popover="auto"`) anchored to the input via CSS anchor positioning. Opened on input focus, closed via a close button or after preset selection.

---

## Calendar grid generation

```ts
function generateCalendar (month: Temporal.PlainDate, weekStartsOn: WeekStart): Temporal.PlainDate[] {
  const first = startOfMonth(month)
  const last = endOfMonth(month)
  const gridStart = startOfWeek(first, weekStartsOn)
  const gridEnd = endOfWeek(last, weekStartsOn)

  const days: Temporal.PlainDate[] = []
  let cur = gridStart
  while (Temporal.PlainDate.compare(cur, gridEnd) <= 0) {
    days.push(cur)
    cur = cur.add({ days: 1 })
  }
  return days
}
```

---

## Built-in preset content

### `defaultDateRangePresets({ excludeCurrentPeriod: false })` (regular)

| Label | start | end |
|---|---|---|
| Today | today | today |
| Yesterday | yesterday | yesterday |
| Last 7 days | today - 6d | today |
| Last 14 days | today - 13d | today |
| Last 30 days | today - 29d | today |
| This month | startOfMonth(today) | today |
| Last month | startOfMonth(lastMonth) | endOfMonth(lastMonth) |

### `defaultDateRangePresets({ excludeCurrentPeriod: true })` (analytics)

| Label | start | end |
|---|---|---|
| Today | today | today + 1d |
| Yesterday | yesterday | yesterday + 1d |
| Previous week | startOfWeek(today) - 1w | startOfWeek(today) - 1d |
| Previous 4 weeks | startOfWeek(today) - 4w | endOfWeek(today) - 1w |
| Previous month | startOfMonth(today) - 1mo | endOfMonth(today) - 1mo |

### `defaultDatePresets()`

| Label | value |
|---|---|
| Today | today |
| Yesterday | yesterday |

---

## Nice-to-have features (in scope if straightforward, otherwise defer)

- **`showTodayButton`** prop — a dedicated "Today" shortcut in the navigation bar, always visible regardless of presets; taps `Temporal.Now.plainDateISO()` and navigates the view + optionally selects

---

## Direct text entry

The input is **not readonly**. Users can type dates directly without opening the calendar.

### Scope

- **`DatePicker`**: supported — parsing a single date is unambiguous
- **`DateRangePicker`**: not supported — range parsing is ambiguous (separator placement, partial ranges). The range picker input remains readonly; open the calendar to select.

### Parsing

Add to `~/lib/temporal.ts`:

```ts
export function parseDate (text: string): Temporal.PlainDate | null
```

Attempts to parse in order:
1. ISO format: `yyyy-MM-dd`
2. Display format: `dd. MM. yyyy` (with flexible spacing/separators)

Returns `null` for anything that doesn't match or produces an invalid date.

Both pickers accept an override:

```ts
parseInput?: (text: string) => Temporal.PlainDate | null   // DatePicker only
```

### Input state machine (`DatePicker`)

Introduce a `draftText: string | null` reactive value alongside `displayValue`:

- `draftText === null` → input shows `displayValue` (committed state)
- `draftText !== null` → input shows `draftText` (user is typing)

**`@focus`**: open popover; `draftText` stays null until first keystroke  
**`@input`**: set `draftText = event.target.value`; attempt `parseInput(draftText)`:
  - valid → update `currentMonth` to parsed date's month (live calendar navigation)
  - invalid / partial → do nothing to `currentMonth` or modelValue  

**`@blur` / Enter**: if `draftText !== null`:
  - valid parse → emit `update:modelValue`, set `draftText = null`, close popover
  - invalid → revert: set `draftText = null` (input snaps back to last `displayValue`), do not emit  

**Escape**: revert `draftText = null`, close popover, do not emit

### Visual feedback

- While `draftText` is non-null and `parseInput(draftText) === null`: apply an error/invalid style on the input (e.g. red border)
- While `draftText` is non-null and parse succeeds: calendar highlights the parsed date live

## Future improvements (out of scope for this version)

- **Multi-date selection** — `modelValue: Temporal.PlainDate[]`, independent day toggles; requires a distinct selection model
- **Day content slot** — a render prop or slot for injecting event indicators, availability dots, or custom markup into day cells without forking the component
- **Time picking** — extend to `Temporal.PlainDateTime` or a separate `DateTimePicker`; significant additional UI (hour/minute inputs or clock face); affects value serialization throughout
- **Month/year view switching** — a `view` prop cycling between day → month → year selection; requires CalendarMonth to be view-aware, rendering a month or year grid instead of a day grid
- **Timezone support** — `Temporal.ZonedDateTime` values with a `timeZone` prop; `PlainDate` is already the right choice for timezone-agnostic date picking, so this would be a separate component variant
- **Component override/injection system** — a `components` prop accepting partial overrides (e.g. custom nav buttons, custom day cell wrapper) for deep customization without forking; requires stable override points throughout the render tree

---

## Known implementation TODOs

- Disable "next month" nav button when `maxDate` month is already the last visible panel
- "Jump to today's month" button
- Fix CSS typo: `noyne` → `none` in `.disabled:hover` rule

---

## Verification

1. `DatePicker`: clicking a day emits `Temporal.PlainDate`, popover closes; inline mode emits without closing
2. `DateRangePicker`: two-click selection produces `{ start, end }` with correct ordering regardless of click direction; hover preview updates live
3. `minDate` / `maxDate` / `disabledDates`: all three compose correctly — disabled days cannot be clicked, styled accordingly
4. `clearable`: × clears value; in inline mode the "Clear" button does the same
5. `inline`: calendar renders without input/popover; labels/placeholder/name props are inert
6. `showWeekNumbers`: an extra left column appears with correct ISO week numbers per row
7. `locale`: month names in calendar header reflect the given locale; week start derived from locale when `weekStartsOn` is not explicitly set
8. `weekStartsOn: 'sunday'`: grid and header both start on Sunday
9. Presets: clicking emits correct value and closes popover (or clears selection state in inline mode); omitting `presets` hides the sidebar entirely
10. Calendar grid: 5 or 6 rows, adjacent-month padding cells present with `other-month` class, clickable
11. `navigateOnOutsideDayClick: true` (default): clicking an adjacent-month day navigates the view to that month and selects the day
12. `navigateOnOutsideDayClick: false`: clicking an adjacent-month day selects it without shifting the view
13. Nav: next button disabled when `maxDate` month is the last visible panel
14. Keyboard: arrow keys move focus through the grid; Enter selects; PageUp/PageDown changes month; roving tabindex moves correctly across month boundaries when multiple months are shown
15. ARIA: each day cell has a descriptive `aria-label`; selected cells have `aria-selected="true"`; disabled cells have `aria-disabled="true"`; day-of-week headers have full weekday `aria-label`
16. Focus trap: Tab key cannot escape the open popover; Escape returns focus to the input
17. Live region: screen reader announces the month name on nav changes
16. `formatValue` / `formatRange`: custom formatter overrides the default input display string
17. Direct text entry (`DatePicker`): typing a valid date navigates calendar live and emits on blur/Enter; typing an invalid date shows error style and reverts on blur; Escape reverts without emitting
18. `parseInput` prop: custom parser used instead of default ISO/display-format detection
19. Display value formatting covers all seven cases in the table above
