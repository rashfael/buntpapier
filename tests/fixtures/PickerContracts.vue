<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { Temporal } from '@js-temporal/polyfill'
import DatePicker from '../../src/components/date-picker/date-picker.vue'
import DateRangePicker from '../../src/components/date-picker/date-range-picker.vue'

const date = Temporal.PlainDate.from('2026-09-16')
let single = $ref<Temporal.PlainDate | null>(date)
let embedded = $ref<Temporal.PlainDate | null>(date)
let range = $ref<{ start: Temporal.PlainDate | null, end: Temporal.PlainDate | null }>({ start: date, end: date.add({ days: 4 }) })
let embeddedRange = $ref<{ start: Temporal.PlainDate | null, end: Temporal.PlainDate | null }>({ start: date, end: date.add({ days: 2 }) })
let disabled = $ref(false)
let readonly = $ref(false)
let hidden = $ref(false)
let inert = $ref(false)
let present = $ref(true)
let alternate = $ref(false)
let slotHint = $ref(false)
let compact = $ref(false)
let naming = $ref(0)
let untabbable = $ref(false)
let suppression = $ref('auto')
let events = $ref<string[]>([])
let submits = $ref(0)
let singleUpdates = $ref(0)
// eslint-disable-next-line no-unassigned-vars -- assigned from the template (@click.capture)
let captured: Event
const singlePicker = useTemplateRef('singlePicker')
const embeddedPicker = useTemplateRef('embeddedPicker')
const rangePicker = useTemplateRef('rangePicker')
const disabledEmbedded = useTemplateRef('disabledEmbedded')

const presets = [{ label: 'Reference date', getValue: () => date }]
const rangePresets = [{ label: 'Reference range', getValue: () => ({ start: date, end: date.add({ days: 4 }) }) }]
const weekends = (d: Temporal.PlainDate) => d.dayOfWeek >= 6 ? { disabled: true, reason: 'Weekends are closed' } : false

const attrs = $computed(() => ({
	id: 'single-control',
	class: alternate ? 'alternate' : 'original',
	// 'direct' declares the token on the picker itself; the other cases use an ancestor.
	style: { width: '320px', '--input-clear': suppression === 'direct' ? 'none' : undefined },
	lang: alternate ? 'de' : 'en',
	dir: alternate ? 'rtl' : 'ltr',
	hidden,
	inert,
	tabindex: untabbable ? -1 : undefined,
	name: alternate ? 'changed' : 'booking',
	autocomplete: 'off',
	maxlength: alternate ? 8 : 20,
	'aria-label': naming ? 'Caller name' : undefined,
	'aria-labelledby': naming === 2 ? 'second' : undefined,
	'aria-describedby': alternate ? 'extra second' : 'extra'
}))

// Suppression drives the public token from an ancestor class, directly on the field's own wrapper,
// and with values the contract resolves back to `auto`.
const innerStyle = $computed(() => {
	if (suppression === 'invalid') return '--input-clear: sometimes'
	if (suppression === 'empty') return '--input-clear: ;'
	return ''
})

// Any pointer or keyboard route to a control outside an open picker dismisses it first, so the
// application-driven disable a picker can actually meet while open arrives through an event.
function disableFromApplication () {
	disabled = true
}
onMounted(() => window.addEventListener('disable-pickers', disableFromApplication))
onBeforeUnmount(() => window.removeEventListener('disable-pickers', disableFromApplication))

function recordSingle (value: Temporal.PlainDate | null) {
	singleUpdates++
	single = value
}

function setSuppression (event: Event) {
	suppression = (event.target as HTMLSelectElement).value
}

function record (name: string, event?: Event) {
	events.push(event ? `${name}:${event === captured}:${(event.target as HTMLElement)?.tagName.toLowerCase()}` : name)
}
</script>
<template lang="pug">
main.c-picker-contracts
	h1 Picker contracts
	p#extra Caller description
	p#second Second description
	label(for="single-control") External name
	button(@click="singlePicker?.focus({ preventScroll: true })") Focus single
	button(@click="embeddedPicker?.focus({ preventScroll: true })") Focus embedded
	button(@click="rangePicker?.focus({ preventScroll: true })") Focus range
	button(@click="disabledEmbedded?.focus({ preventScroll: true })") Focus disabled embedded
	button(@mousedown.prevent="", @click="disabled = !disabled") Toggle disabled
	button(@mousedown.prevent="", @click="readonly = !readonly") Toggle readonly
	button(@mousedown.prevent="", @click="hidden = !hidden") Toggle hidden
	button(@mousedown.prevent="", @click="inert = !inert") Toggle inert
	button(@mousedown.prevent="", @click="present = !present") Toggle mounted
	button(@mousedown.prevent="", @click="alternate = !alternate") Change bindings
	button(@mousedown.prevent="", @click="naming = (naming + 1) % 3") Change name
	button(@mousedown.prevent="", @click="slotHint = !slotHint") Toggle hint slot
	button(@mousedown.prevent="", @click="compact = !compact") Toggle compact
	button(@mousedown.prevent="", @click="untabbable = !untabbable") Toggle tabindex
	button(@mousedown.prevent="", @click="single = date.with({ day: 25 }); range = { start: date.with({ day: 25 }), end: date.with({ day: 27 }) }") Update models
	button(@mousedown.prevent="", @click="events = []") Clear events
	label
		| Clear policy
		select(data-testid="suppression", :value="suppression", @change="setSuppression")
			option(value="auto") auto
			option(value="ancestor") ancestor
			option(value="direct") direct
			option(value="invalid") invalid
			option(value="empty") empty

	form(novalidate, @submit.prevent="submits++")
		label(for="plain-control") Plain control
		input#plain-control(name="plain", value="typed")
		button.spacious(type="submit") Submit form

		.clear-outer(:class="{ 'clear-suppressed': suppression === 'ancestor' || suppression === 'empty' }")
			.clear-inner(:style="innerStyle")
				fieldset(data-case="single")
					legend Popup single
					button(type="button") Before single
					DatePicker(
						v-if="present",
						ref="singlePicker",
						v-bind="attrs",
						:modelValue="single",
						label="Delivery date",
						hint="Choose a working day",
						locale="en-US",
						weekStartsOn="monday",
						:disabled="disabled",
						:readonly="readonly",
						:presets="presets",
						:disabledDates="weekends",
						@update:modelValue="recordSingle",
						@click.capture="captured = $event",
						@click="record('single-click', $event)",
						@input="record('single-input', $event)",
						@change="record('single-change', $event)",
						@focus="record('single-focus')",
						@blur="record('single-blur')"
					)
						template(v-if="slotHint", #hint)
							| Slot guidance
					button(type="button") After single
					output(data-testid="single-value") {{ single?.toString() ?? 'empty' }}

				fieldset(data-case="range")
					legend Popup range
					DateRangePicker(
						id="range-control",
						ref="rangePicker",
						v-model="range",
						label="Stay",
						hint="Pick two days",
						locale="en-US",
						weekStartsOn="monday",
						:disabled="disabled",
						:readonly="readonly",
						:presets="rangePresets",
						@focus="record('range-focus')",
						@blur="record('range-blur')"
					)
					output(data-testid="range-value") {{ range.start?.toString() ?? 'empty' }} / {{ range.end?.toString() ?? 'empty' }}

				fieldset(data-case="embedded")
					legend Embedded single
					DatePicker(
						id="embedded-control",
						ref="embeddedPicker",
						v-model="embedded",
						label="Embedded date",
						hint="Embedded guidance",
						locale="en-US",
						weekStartsOn="monday",
						inline,
						:tabindex="untabbable ? -1 : undefined",
						:disabled="disabled",
						:readonly="readonly",
						:presets="presets",
						@focus="record('embedded-focus')",
						@blur="record('embedded-blur')"
					)
					output(data-testid="embedded-value") {{ embedded?.toString() ?? 'empty' }}

				fieldset(data-case="embedded-range")
					legend Embedded range
					DateRangePicker(
						id="embedded-range-control",
						v-model="embeddedRange",
						label="Embedded stay",
						locale="en-US",
						weekStartsOn="monday",
						inline,
						:monthsToShow="1",
						:readonly="readonly"
					)
					output(data-testid="embedded-range-value") {{ embeddedRange.start?.toString() ?? 'empty' }} / {{ embeddedRange.end?.toString() ?? 'empty' }}

		fieldset(data-case="disabled-embedded")
			legend Disabled embedded
			DatePicker(
				id="disabled-embedded-control",
				ref="disabledEmbedded",
				:modelValue="date",
				label="Unavailable date",
				hint="Not bookable in this period",
				locale="en-US",
				weekStartsOn="monday",
				inline,
				disabled
			)

	//- Mounted on demand so the extra pickers stay out of the other cases' tab order and scans.
	fieldset(v-if="compact", data-case="compact", style="--input-size: compact")
		legend Compact
		DatePicker(:modelValue="date", label="Compact popup", hint="Compact popup guidance", locale="en-US")
		DatePicker(:modelValue="date", label="Compact inline", hint="Compact inline guidance", locale="en-US", inline)
		DateRangePicker(:modelValue="range", label="Compact inline range", hint="Compact range guidance", locale="en-US", inline, :monthsToShow="1")

	button(type="button") Outside
	output(data-testid="single-updates") {{ singleUpdates }}
	output(data-testid="exposed-root") {{ singlePicker?.el?.classList?.contains('bunt-date-picker') ?? 'none' }}
	output(data-testid="events") {{ JSON.stringify(events) }}
	output(data-testid="submits") {{ submits }}
</template>
<style>
.clear-suppressed { --input-clear: none; }
.c-picker-contracts fieldset { margin: 4px 0; }
/* The fixture's own native controls are not under test; size them so they do not fail the scan. */
.c-picker-contracts #plain-control, .c-picker-contracts .spacious { min-height: 28px; }
</style>
