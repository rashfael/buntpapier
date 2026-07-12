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
	formatValue: { type: '(d) => string', description: 'Override display string' },
	parseInput: { type: '(text) => Temporal.PlainDate | null', description: 'Override text parsing' },
}

const events = {
	'update:modelValue': { description: 'Emitted on selection or clear. Payload: Temporal.PlainDate | null' },
}
</script>

# DatePicker

Selects a single `Temporal.PlainDate`.

<Showcase
	:editable="true"
	componentName="bunt-date-picker"
	:props="props"
	:slots="{}"
/>

<!-- ## With min/max dates

<Showcase componentName="bunt-date-picker" :props="{ label: { type: 'string', value: 'Pick a date' }, minDate: { value: minDate }, maxDate: { value: maxDate } }" :slots="{}" />

## Disabled weekends

<Showcase componentName="bunt-date-picker" :props="{ label: { type: 'string', value: 'Pick a date' }, disabledDates: { value: disabledWeekends } }" :slots="{}" />

## With presets

<Showcase componentName="bunt-date-picker" :props="{ label: { type: 'string', value: 'Pick a date' }, presets: { value: defaultDatePresets() }, clearable: { type: 'boolean', default: true } }" :slots="{}" />

## Show week numbers

<Showcase componentName="bunt-date-picker" :props="{ label: { type: 'string', value: 'Pick a date' }, showWeekNumbers: { type: 'boolean', default: true } }" :slots="{}" />

## Inline mode

<Showcase componentName="bunt-date-picker" :props="{ clearable: { type: 'boolean', default: true }, inline: { type: 'boolean', default: true } }" :slots="{}" /> -->

## API

<ApiDocs :props="allProps" :events="events" />
