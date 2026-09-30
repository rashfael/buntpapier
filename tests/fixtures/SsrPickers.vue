<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import DatePicker from '../../src/components/date-picker/date-picker.vue'
import DateRangePicker from '../../src/components/date-picker/date-range-picker.vue'

const date = Temporal.PlainDate.from('2026-09-16')
const range = { start: date, end: date.add({ days: 3 }) }
</script>
<template lang="pug">
main
	h1 Server rendered pickers
	DatePicker(label="First date", hint="First hint", :modelValue="date", locale="en-US")
	DatePicker(label="Second date", :modelValue="date", locale="en-US")
	DateRangePicker(label="Third range", hint="Third hint", :modelValue="range", locale="en-US")
	DatePicker(label="Fourth date", hint="Fourth hint", :modelValue="date", locale="en-US", inline)
	DateRangePicker(label="Fifth range", :modelValue="range", locale="en-US", inline)
	#bunt-teleport-target
</template>
