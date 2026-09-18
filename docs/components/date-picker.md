---
title: date-picker
layoutClass: 'component'
---

<script setup>
import { Temporal } from '@js-temporal/polyfill'
import { defaultDatePresets } from '../../src/components/date-picker/temporal'

const minDate = Temporal.Now.plainDateISO().subtract({ days: 30 })
const maxDate = Temporal.Now.plainDateISO().add({ days: 60 })

function disabledWeekends (d) {
	return d.dayOfWeek >= 6
}

const props = {
	modelValue: { value: null },
	label: { type: 'string', value: 'Pick a date' },
	placeholder: { type: 'string' },
	disabled: { type: 'boolean', default: false },
	clearable: { type: 'boolean', default: false },
	showWeekNumbers: { type: 'boolean', default: false },
}

const allProps = {
	modelValue: { type: 'Temporal.PlainDate | null', description: 'Current value (v-model)' },
	label: { type: 'string', description: 'Input label' },
	placeholder: { type: 'string', description: 'Input placeholder' },
	disabled: { type: 'boolean', default: 'false', description: 'Disables the picker' },
	name: { type: 'string', description: 'Input name attribute' },
	minDate: { type: 'Temporal.PlainDate', description: 'Earliest selectable date' },
	maxDate: { type: 'Temporal.PlainDate', description: 'Latest selectable date' },
	disabledDates: { type: '(d) => boolean | { disabled, reason? }', description: 'Per-day disable callback' },
	monthsToShow: { type: 'number', default: '1', description: 'Number of month panels' },
	weekStartsOn: { type: "'monday' | 'sunday'", default: 'locale', description: 'Week start day' },
	locale: { type: 'string', default: 'navigator.language', description: 'BCP 47 locale tag' },
	showWeekNumbers: { type: 'boolean', default: 'false', description: 'Show ISO week numbers' },
	clearable: { type: 'boolean', default: 'false', description: 'Show × clear button' },
	inline: { type: 'boolean', default: 'false', description: 'Render without input/popover' },
	navigateOnOutsideDayClick: { type: 'boolean', default: 'true', description: 'Clicking adjacent-month day advances view' },
	presets: { type: 'DatePreset<Temporal.PlainDate>[]', description: 'Preset shortcut buttons' },
	parseInput: { type: '(text) => Temporal.PlainDate | null', description: 'Override text parsing' },
}

const events = {
	'update:modelValue': { description: 'Emitted on selection or clear. Payload: Temporal.PlainDate | null' },
}
</script>

# DatePicker

Selects a single `Temporal.PlainDate`. The input displays `YYYY-MM-DD` and accepts ISO or dotted day-month-year text (for example, `23.04.2026`). Use `parseInput` for other input formats. Invalid or disabled dates are discarded on blur or Enter. Focusing an empty field leaves the value empty.

<Showcase
	:editable="true"
	componentName="bunt-date-picker"
	:props="props"
	:slots="{}"
/>

## Clearable

<Showcase componentName="bunt-date-picker" :props="{ modelValue: { value: null }, label: { type: 'string', value: 'Pick a date' }, clearable: { type: 'boolean', default: true } }" :slots="{}" />

## With min/max dates

<Showcase componentName="bunt-date-picker" :props="{ modelValue: { value: null }, label: { type: 'string', value: 'Pick a date' }, minDate: { value: minDate }, maxDate: { value: maxDate } }" :slots="{}" />

## Disabled weekends

<Showcase componentName="bunt-date-picker" :props="{ modelValue: { value: null }, label: { type: 'string', value: 'Pick a date' }, disabledDates: { value: disabledWeekends } }" :slots="{}" />

## With presets

<Showcase componentName="bunt-date-picker" :props="{ modelValue: { value: null }, label: { type: 'string', value: 'Pick a date' }, presets: { value: defaultDatePresets() }, clearable: { type: 'boolean', default: true } }" :slots="{}" />

## Show week numbers

<Showcase componentName="bunt-date-picker" :props="{ modelValue: { value: null }, label: { type: 'string', value: 'Pick a date' }, showWeekNumbers: { type: 'boolean', default: true } }" :slots="{}" />

## Inline mode

<Showcase wide componentName="bunt-date-picker" :props="{ modelValue: { value: null }, clearable: { type: 'boolean', default: true }, inline: { type: 'boolean', default: true } }" :slots="{}" />

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

The input stays editable while the calendar is open. Left/Right move between ISO segments; Up/Down increment or decrement the active segment. Typing over a selected segment replaces it. Select-all, copy, paste, cut, Home, End, Backspace and Delete keep their native text-field behavior. Enter commits valid input; Escape discards an uncommitted draft. Selecting a calendar day or preset commits the value, closes the popover, and returns focus to the input. Clear resets the value to `null`.

The format and Alt+Down shortcut are associated with the input through `aria-describedby`. Segment selection is text selection within one input; segments do not expose separate spinbutton roles.

Navigation labels, weekday headings, and built-in preset labels are currently English. `locale` controls month and full-date labels. A shared strings API and the mobile modal layout are still pending.

Automated coverage uses Playwright keyboard tests and ARIA snapshots. Manual NVDA/Firefox and VoiceOver/Safari testing has not been recorded yet.

## API

<ApiDocs :props="allProps" :events="events" />
