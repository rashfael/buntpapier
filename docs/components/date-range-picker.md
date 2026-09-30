---
title: date-range-picker
layoutClass: 'component'
---

<script setup>
import { defaultDateRangePresets } from '../../src/components/date-picker/temporal'

const slots = {
	hint: { description: 'Rich hint content; replaces the `hint` prop text' },
}

const props = {
	modelValue: { value: { start: null, end: null } },
	label: { type: 'string', value: 'Pick a range' },
	placeholder: { type: 'string' },
	hint: { type: 'string' },
	disabled: { type: 'boolean', default: false },
	readonly: { type: 'boolean', default: false },
	showWeekNumbers: { type: 'boolean', default: false },
	monthsToShow: { type: 'number', value: 2, min: 1 },
}

const allProps = {
	modelValue: { type: 'DateRange', description: 'Current value { start, end } (v-model)' },
	label: { type: 'string', description: 'Input label' },
	placeholder: { type: 'string', description: 'Input placeholder' },
	hint: { type: 'string', description: 'Guidance below the field, associated as its description' },
	disabled: { type: 'boolean', default: 'false', description: 'Blocks opening, navigation, presets and clearing; the picker stays focusable so it can still be explained' },
	readonly: { type: 'boolean', default: 'false', description: 'Blocks value changes while focus, copying, opening and calendar navigation remain available' },
	minDate: { type: 'Temporal.PlainDate', description: 'Earliest selectable date' },
	maxDate: { type: 'Temporal.PlainDate', description: 'Latest selectable date' },
	disabledDates: { type: '(d) => boolean | { disabled, reason? }', description: 'Per-day disable callback' },
	monthsToShow: { type: 'number', default: '2', description: 'Number of month panels' },
	weekStartsOn: { type: "'monday' | 'sunday'", default: 'locale', description: 'Week start day' },
	locale: { type: 'string', default: 'navigator.language', description: 'BCP 47 locale tag' },
	showWeekNumbers: { type: 'boolean', default: 'false', description: 'Show ISO week numbers' },
	inline: { type: 'boolean', default: 'false', description: 'Render without input/popover' },
	navigateOnOutsideDayClick: { type: 'boolean', default: 'true', description: 'Clicking adjacent-month day advances view' },
	presets: { type: 'DatePreset<DateRange>[]', description: 'Preset shortcut buttons' },
	formatRange: { type: '(r: DateRange) => string', description: 'Override entire input display string' },
}

const events = {
	'update:modelValue': { description: 'Emitted after second click, preset selection or clear. Payload: DateRange' },
	focus: { description: 'Focus entered the whole component, including its calendar popup' },
	blur: { description: 'Focus left the whole component' },
}

const style = {
	'--input-clear': { type: 'enum', values: ['auto', 'none'], default: 'auto', description: 'Whether the clear action appears when either endpoint is set and the control is editable' },
	'--input-shape': { type: 'enum', values: ['pill', 'rounded', 'squared'], default: 'pill' },
	'--input-size': { type: 'enum', values: ['normal', 'large', 'compact'], default: 'normal' },
}
</script>

# DateRangePicker

Selects a `{ start, end }` pair of `Temporal.PlainDate`.

Click once to set the start, click again to set the end. Hover while selecting to preview the range.

<Showcase
	:editable="true"
	componentName="bunt-date-range-picker"
	:props="props"
	:slots="{}"
	:style="style"
/>

## Clear action

`--input-clear` controls the clear action; it inherits, so one declaration configures a whole form. Readonly and disabled pickers do not offer it.

```css
.booking-filters {
	--input-clear: none;
}
```

## With presets

<Showcase componentName="bunt-date-range-picker" :props="{ modelValue: { value: { start: null, end: null } }, label: { type: 'string', value: 'Pick a range' }, presets: { value: defaultDateRangePresets() } }" :slots="{}" />

## Single month

<Showcase componentName="bunt-date-range-picker" :props="{ modelValue: { value: { start: null, end: null } }, label: { type: 'string', value: 'Pick a range' }, monthsToShow: { type: 'number', value: 1 } }" :slots="{}" />

## Inline mode

<Showcase wide componentName="bunt-date-range-picker" :props="{ modelValue: { value: { start: null, end: null } }, label: { type: 'string', value: 'Pick a range' }, inline: { type: 'boolean', default: true }, presets: { value: defaultDateRangePresets() } }" :slots="{}" />

## Accessibility

The calendar uses the [APG date-picker grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/) inside a non-modal dialog. Clicking the field opens the calendar and keeps focus in the input. Alt+Down opens it and focuses the selected date, or today when empty (clamped to min/max). Each visible month has one day in the Tab order. Disabled dates can receive arrow-key focus so their state can be read, but cannot be selected.

| Context | Key | Action |
|---|---|---|
| Input | Tab / Shift+Tab | Move through the form without opening the calendar |
| Input | Alt+Down | Open the calendar and focus its active date |
| Calendar | Tab / Shift+Tab | Visit month navigation, one day per month, and presets; leaving the picker closes it |
| Calendar | Left / Right | Previous / next day |
| Calendar | Up / Down | Same weekday in the previous / next week |
| Calendar | Home / End | First / last day of the week |
| Calendar | PageUp / PageDown | Previous / next month, keeping the day where possible |
| Calendar | Shift+PageUp / Shift+PageDown | Previous / next year, keeping the day where possible |
| Calendar | Enter / Space | Select the focused date |
| Open picker | Escape | Close and return focus to the input |
| Navigation, presets, clear | Enter / Space | Activate the button |

The input exposes `combobox`, `aria-expanded`, and `aria-controls`. Each month has a unique grid label; `aria-selected` belongs to the gridcells. One live region announces month changes. Inline mode uses the same grid and keyboard controls without an input or dialog.

The range input is read-only. Enter or Space selects the start, then the end; the picker sorts the endpoints before committing. Arrow navigation previews the range after choosing its start. Escape or leaving the picker cancels that preview and preserves the committed range. A status region announces “Start selected, choose end date.” Clear emits `{ start: null, end: null }`.

Navigation labels, weekday headings, and built-in preset labels are currently English. `locale` controls month and full-date labels. A shared strings API and the mobile modal layout are still pending.

Automated coverage uses Playwright keyboard tests and ARIA snapshots. Manual NVDA/Firefox and VoiceOver/Safari testing has not been recorded yet.

## API

Undeclared attributes and listeners are routed: `class`, `style`, `data-*`, `lang`, `dir`, `hidden`, `inert` and `title` reach the component root, everything else — including `id`, `name`, `tabindex` and native listeners — reaches the display textbox, or the calendar's named group when `inline`.

<ApiDocs :slots="slots" :props="allProps" :events="events" :style="style" />

| Exposed member | Description |
|---|---|
| `focus(options?: FocusOptions): void` | Focuses the display textbox, or the calendar's focused day when `inline`, without opening the calendar. Does nothing if the picker is hidden, inert or unmounted. |
| `el` | Component root element. |
