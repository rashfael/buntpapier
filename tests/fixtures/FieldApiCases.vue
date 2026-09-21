<script setup lang="ts">
// Source consumer cases for packaging's macro/Pug and declaration checks.
import { useTemplateRef, reactive } from 'vue'
import Input from '../../src/components/input.vue'
import Select from '../../src/components/select.vue'

let text = $ref<string | number>('Text')
let number = $ref<string | number>(42)
const objectOption = reactive({ label: 'Object' })
let selected = $ref<string | number | object>(objectOption)
const input = useTemplateRef('input')
const select = useTemplateRef('select')
function nativeEvent (event: Event) {
	const target: EventTarget | null = event.target
	return target
}
function focus () {
	input.value?.focus({ preventScroll: true })
	select.value?.focus()
}
</script>
<template lang="pug">
main
	h1 Source API cases
	Input(ref="input", v-model="text", label="Text", type="text", readonly, @input="nativeEvent", @change="nativeEvent")
		template(#hint) Guidance
	Input(v-model="number", label="Number", type="number", disabled)
	Select(ref="select", v-model="selected", label="Object", :options="[objectOption]", optionValue="", readonly, @input="nativeEvent", @change="nativeEvent")
		template(#hint) Guidance
		template(#default="{ option, index, selected, active, group, isFirstOfGroup }")
			span {{ option.label }} {{ index }} {{ selected }} {{ active }} {{ group }} {{ isFirstOfGroup }}
		template(#group="{ group, Options, options }")
			span {{ group.label }} {{ options.length }}
			component(:is="Options")
	Select(:modelValue="1", label="Numeric", :options="[{ label: 'One', value: 1 }]")
	Select(modelValue="one", label="String", :options="['one']")
	button(@click="focus") Focus
	#bunt-teleport-target
</template>
