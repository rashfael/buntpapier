---
title: date-range-picker
layoutClass: 'component'
---

<script setup>
import { defaultDateRangePresets } from '../../src/components/date-picker/temporal'

const props = {
	label: { type: 'string', value: 'Pick a range' },
	placeholder: { type: 'string' },
	disabled: { type: 'boolean', default: false },
	clearable: { type: 'boolean', default: false },
	showWeekNumbers: { type: 'boolean', default: false },
	monthsToShow: { type: 'number', value: 2 },
}

const allProps = {
	modelValue: { type: 'DateRange', description: 'Current value { start, end } (v-model)' },
	label: { type: 'string', description: 'Input label' },
	placeholder: { type: 'string', description: 'Input placeholder' },
	disabled: { type: 'boolean', default: 'false', description: 'Disables the picker' },
	name: { type: 'string', description: 'Input name attribute' },
	minDate: { type: 'Temporal.PlainDate', description: 'Earliest selectable date' },
	maxDate: { type: 'Temporal.PlainDate', description: 'Latest selectable date' },
	disabledDates: { type: '(d) => boolean | { disabled, reason? }', description: 'Per-day disable callback' },
	monthsToShow: { type: 'number', default: '2', description: 'Number of month panels' },
	weekStartsOn: { type: "'monday' | 'sunday'", default: 'locale', description: 'Week start day' },
	locale: { type: 'string', default: 'navigator.language', description: 'BCP 47 locale tag' },
	showWeekNumbers: { type: 'boolean', default: 'false', description: 'Show ISO week numbers' },
	clearable: { type: 'boolean', default: 'false', description: 'Show × clear button' },
	inline: { type: 'boolean', default: 'false', description: 'Render without input/popover' },
	navigateOnOutsideDayClick: { type: 'boolean', default: 'true', description: 'Clicking adjacent-month day advances view' },
	presets: { type: 'DatePreset<DateRange>[]', description: 'Preset shortcut buttons' },
	formatRange: { type: '(r: DateRange) => string', description: 'Override entire input display string' },
}

const events = {
	'update:modelValue': { description: 'Emitted after second click or preset selection. Payload: DateRange' },
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
/>

## With presets

<Showcase componentName="bunt-date-range-picker" :props="{ label: { type: 'string', value: 'Pick a range' }, presets: { value: defaultDateRangePresets() }, clearable: { type: 'boolean', default: true } }" :slots="{}" />

## Single month

<Showcase componentName="bunt-date-range-picker" :props="{ label: { type: 'string', value: 'Pick a range' }, monthsToShow: { type: 'number', value: 1 } }" :slots="{}" />

## Inline mode

<Showcase componentName="bunt-date-range-picker" :props="{ clearable: { type: 'boolean', default: true }, inline: { type: 'boolean', default: true }, presets: { value: defaultDateRangePresets() } }" :slots="{}" />

## API

<ApiDocs :props="allProps" :events="events" />
