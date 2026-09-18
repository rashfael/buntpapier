<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'

const date = Temporal.PlainDate.from('2026-09-16')
const single = $ref(date)
const empty = $ref(null)
const restricted = $ref(date)
const weekends = $ref(date)
const inline = $ref(date)
const range = $ref({ start: null, end: null })
const inlineRange = $ref({ start: null, end: null })
const submissions = $ref(0)
const presets = [{ label: 'Reference date', getValue: () => date }]
const rangePresets = [{ label: 'Reference range', getValue: () => ({ start: date, end: date.add({ days: 4 }) }) }]
</script>
<template lang="pug">
form.c-date-picker-fixture(@submit.prevent="submissions++")
	fieldset
		legend Single date
		button(type="button") Before single
		bunt-date-picker(v-model="single", label="Single date", locale="en-US", weekStartsOn="monday", clearable, :presets="presets")
		button(type="button") After single
		output(data-testid="single-value") {{ single?.toString() ?? 'empty' }}
	fieldset
		legend Empty date
		bunt-date-picker(v-model="empty", label="Empty date", locale="en-US", weekStartsOn="monday")
		output(data-testid="empty-value") {{ empty?.toString() ?? 'empty' }}
	fieldset
		legend Restricted date
		bunt-date-picker(v-model="restricted", label="Restricted date", locale="en-US", weekStartsOn="monday", :minDate="date.with({ day: 10 })", :maxDate="date.with({ day: 20 })")
	fieldset
		legend Disabled weekends
		bunt-date-picker(v-model="weekends", label="Weekday", locale="en-US", weekStartsOn="monday", :disabledDates="day => day.dayOfWeek >= 6")
	fieldset
		legend Inline date
		bunt-date-picker(v-model="inline", locale="en-US", weekStartsOn="monday", inline, clearable, showWeekNumbers)
		output(data-testid="inline-value") {{ inline?.toString() ?? 'empty' }}
	fieldset
		legend Disabled date
		bunt-date-picker(:modelValue="date", label="Disabled date", disabled, clearable)
	fieldset
		legend Range
		button(type="button") Before range
		bunt-date-range-picker(v-model="range", label="Date range", locale="en-US", weekStartsOn="monday", clearable, :presets="rangePresets")
		button(type="button") After range
		output(data-testid="range-value") {{ range.start?.toString() ?? 'empty' }} / {{ range.end?.toString() ?? 'empty' }}
	fieldset
		legend Inline range
		bunt-date-range-picker(v-model="inlineRange", locale="en-US", weekStartsOn="monday", inline, clearable)
		output(data-testid="inline-range-value") {{ inlineRange.start?.toString() ?? 'empty' }} / {{ inlineRange.end?.toString() ?? 'empty' }}
	output(data-testid="submissions") {{ submissions }}
</template>
