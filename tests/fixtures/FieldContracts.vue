<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Input from '../../src/components/input.vue'
import Select from '../../src/components/select.vue'

let disabled = $ref(false)
let readonly = $ref(false)
let hidden = $ref(false)
let inert = $ref(false)
let present = $ref(true)
let alternate = $ref(false)
let invalid = $ref(false)
let slotHint = $ref(true)
let naming = $ref(0)
let compact = $ref(false)
let text = $ref<string | number>('Initial')
let selected = $ref<string | number | object>('a')
let kind = $ref<'text' | 'search' | 'email' | 'url' | 'tel' | 'password' | 'number'>('text')
let events = $ref<string[]>([])
let submits = $ref(0)
// eslint-disable-next-line no-unassigned-vars -- assigned from the template (@input.capture etc.)
let captured: Event
const input = useTemplateRef('input')
const select = useTemplateRef('select')
const validation = $computed(() => ({ $error: invalid, $errors: [{ $message: 'Validation message' }], $touch () {} }))
const attrs = $computed(() => ({
	class: alternate ? 'alternate' : 'original',
	style: { '--input-size': compact ? 'compact' : 'normal', '--bunt-will-change': 'all', width: '320px' },
	lang: alternate ? 'de' : 'en',
	dir: alternate ? 'rtl' : 'ltr',
	hidden,
	inert,
	name: alternate ? 'changed' : 'entry',
	autocomplete: 'off',
	maxlength: alternate ? 8 : 20,
	'aria-label': naming ? 'Caller name' : undefined,
	'aria-labelledby': naming === 2 ? 'second' : undefined,
	'aria-describedby': alternate ? 'extra extra second' : 'extra'
}))
function record (name: string, event?: Event) {
	events.push(event ? `${name}:${event === captured}:${event.target instanceof HTMLInputElement}` : name)
}
</script>
<template lang="pug">
main.c-field-contracts
	h1 Field contracts
	p#extra Caller description
	p#second Second description
	label(for="external") External name
	button(@click="input?.focus({ preventScroll: true })") Focus input
	button(@click="select?.focus({ preventScroll: true })") Focus select
	button(@mousedown.prevent="", @click="disabled = !disabled") Toggle disabled
	button(@mousedown.prevent="", @click="readonly = !readonly") Toggle readonly
	button(@mousedown.prevent="", @click="hidden = !hidden") Toggle hidden
	button(@mousedown.prevent="", @click="inert = !inert") Toggle inert
	button(@mousedown.prevent="", @click="present = !present") Toggle mounted
	button(@mousedown.prevent="", @click="alternate = !alternate") Change bindings
	button(@mousedown.prevent="", @click="invalid = !invalid") Toggle validation
	button(@mousedown.prevent="", @click="compact = !compact") Toggle compact
	button(@mousedown.prevent="", @click="text = 'Application'; selected = 'b'") Update models
	button(@mousedown.prevent="", @click="naming = (naming + 1) % 3") Change name
	button(@mousedown.prevent="", @click="slotHint = !slotHint") Toggle hint slot
	button(@click="events = []") Clear events
	label Type
		select(v-model="kind", aria-label="Type")
			option(v-for="value in ['text', 'search', 'email', 'url', 'tel', 'password', 'number']", :value="value") {{ value }}
	form(novalidate, @submit.prevent="submits++", @input.capture="captured = $event", @change.capture="captured = $event", @keydown.capture="captured = $event")
		Input(v-if="present", v-bind="attrs", :id="alternate ? 'changed-input' : 'external'", ref="input", v-model="text", label="Input label", required, :type="kind", :disabled="disabled", :readonly="readonly", :validation="validation", hint="Fallback hint", @focus="record('input-focus')", @blur="record('input-blur')", @input="record('input', $event)", @change="record('change', $event)", @keydown.enter.prevent="record('enter', $event)")
			template(v-if="slotHint", #hint)
				strong Input guidance
		Select(v-if="present", v-bind="attrs", :id="alternate ? 'changed-select' : 'select-entry'", ref="select", v-model="selected", label="Select label", required, :disabled="disabled", :readonly="readonly", :validation="validation", :options="[{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]", @focus="record('select-focus')", @blur="record('select-blur')", @input="record('search', $event)", @change="record('select-change', $event)")
			template(v-if="slotHint", #hint) Select guidance
			template(#result-header)
				button(type="button", @mousedown.stop="") Popup help
		Input(label="Disabled required", required, disabled, tabindex="-1")
		Input(label="Enabled submit", name="submit-control")
		button(type="submit") Submit
	button Outside
	output(data-testid="text") {{ text }}
	output(data-testid="selected") {{ selected }}
	output(data-testid="events") {{ JSON.stringify(events) }}
	output(data-testid="submits") {{ submits }}
	#bunt-teleport-target
</template>
<style lang="sass">
.c-field-contracts
	button, select
		min-height: 28px
		margin: 4px
</style>
