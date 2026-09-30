<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Checkbox from '../../src/components/checkbox.vue'
import Input from '../../src/components/input.vue'

let disabled = $ref(false)
let hidden = $ref(false)
let inert = $ref(false)
let present = $ref(true)
let alternate = $ref(false)
let naming = $ref(0)
let hasSlotLabel = $ref(true)
let labelText = $ref('Prop label')
let checked = $ref(false)
let second = $ref(true)
let third = $ref(false)
let hasEmptySlotContent = $ref(false)
let events = $ref<string[]>([])
let submits = $ref(0)
// eslint-disable-next-line no-unassigned-vars -- assigned from the template (@input.capture etc.)
let captured: Event
const checkbox = useTemplateRef('checkbox')
const attrs = $computed(() => ({
	class: alternate ? 'alternate' : 'original',
	style: { '--bunt-will-change': 'all' },
	'data-case': alternate ? 'changed' : 'initial',
	title: alternate ? 'Changed title' : 'Title',
	lang: alternate ? 'de' : 'en',
	dir: alternate ? 'rtl' : 'ltr',
	hidden,
	inert,
	name: alternate ? 'changed' : 'consent',
	form: alternate ? 'other-form' : 'checkbox-form',
	'aria-label': naming ? 'Caller name' : undefined,
	'aria-labelledby': naming === 2 ? 'second' : undefined,
	'aria-describedby': alternate ? 'extra extra second' : 'extra'
}))
function record (name: string, event?: Event) {
	events.push(event ? `${name}:${event === captured}:${event.target instanceof HTMLInputElement}` : name)
}
</script>
<template lang="pug">
main.c-checkbox-contracts
	h1 Checkbox contracts
	p#extra Caller description
	p#second Second description
	label(for="subject") External name
	button(@click="checkbox?.focus({ preventScroll: true })") Focus checkbox
	button(@mousedown.prevent="", @click="disabled = !disabled") Toggle disabled
	button(@mousedown.prevent="", @click="hidden = !hidden") Toggle hidden
	button(@mousedown.prevent="", @click="inert = !inert") Toggle inert
	button(@mousedown.prevent="", @click="present = !present") Toggle mounted
	button(@mousedown.prevent="", @click="alternate = !alternate") Change bindings
	button(@mousedown.prevent="", @click="naming = (naming + 1) % 3") Change name
	button(@mousedown.prevent="", @click="hasSlotLabel = !hasSlotLabel") Toggle label slot
	button(@mousedown.prevent="", @click="labelText = labelText === 'Prop label' ? '' : 'Prop label'") Toggle label text
	button(@mousedown.prevent="", @click="checked = !checked; second = !second") Update models
	button(@mousedown.prevent="", @click="hasEmptySlotContent = !hasEmptySlotContent") Toggle empty slot content
	button(@click="events = []") Clear events
	form#checkbox-form(novalidate, @submit.prevent="submits++", @input.capture="captured = $event", @change.capture="captured = $event", @click.capture="captured = $event", @keyup.capture="captured = $event")
		Checkbox(v-if="present", v-bind="attrs", :id="alternate ? 'changed-subject' : 'subject'", ref="checkbox", v-model="checked", :label="labelText", :disabled="disabled", @focus="record('focus')", @blur="record('blur')", @input="record('input', $event)", @change="record('change', $event); record(`model:${checked}`)", @click.self="record('click', $event)", @keyup.a="record('key-a', $event)")
			template(v-if="hasSlotLabel", #label)
				strong Slot label
			| Default label
		Checkbox(v-model="second", label="Checked disabled", disabled, tabindex="-1")
		Input(label="Enabled submit", name="submit-control")
		button(type="submit") Submit
	Checkbox(v-model="third", label="Readonly attribute", readonly, aria-checked="mixed")
	label(for="empty-slot") External only
	Checkbox#empty-slot
		span(v-if="hasEmptySlotContent") Slot now names it
	button Outside
	output(data-testid="checked") {{ checked }}
	output(data-testid="second") {{ second }}
	output(data-testid="third") {{ third }}
	output(data-testid="events") {{ JSON.stringify(events) }}
	output(data-testid="submits") {{ submits }}
</template>
<style lang="sass">
.c-checkbox-contracts
	button
		min-height: 28px
		margin: 4px
</style>
