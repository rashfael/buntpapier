<script setup lang="ts">
import Input from '../../src/components/input.vue'
import Select from '../../src/components/select.vue'
let disabled = $ref(false)
let slotHint = $ref(false)
let ancestorHidden = $ref(false)
let value = $ref('a')
let events = $ref([])
const options = [{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]
</script>
<template lang="pug">
main.c-field-boundaries
	h1 Field boundaries
	button#outside Outside
	button#toggle(@mousedown.prevent, @click="disabled = !disabled") Disable
	button#slot(@mousedown.prevent, @click="slotHint = !slotHint") Hint
	button#hide(@mousedown.prevent, @click="ancestorHidden = !ancestorHidden") Hide ancestor
	div(:hidden="ancestorHidden")
		Input#input(label="Input", :disabled="disabled")
		Input#hint(label="Hint")
			template(v-if="slotHint", #hint) Dynamic hint
		Select#select(v-model="value", :options="options", label="Select", :disabled="disabled", @focus="events.push('focus')", @blur="events.push('blur')")
			template(#result-header)
				button#popup-button Popup button
	output {{ JSON.stringify(events) }}
	#bunt-teleport-target
</template>
<style lang="sass">
.c-field-boundaries button
	min-height: 28px
	margin: 4px
</style>
