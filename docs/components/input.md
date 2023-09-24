---
title: input
layoutClass: 'component'
---

<script setup>
const slots = {
	hint: {description: 'If you want to render rich text in the hint, use this, otherwise, use the `hint` prop'}
}
const props = {
	type: {type: 'string', default: 'text', description: 'native input element type attribute'},
	label: {type: 'string', default: 'label'},
	placeholder: {type: 'string'},
	hint: {type: 'string'},
	icon: {type: 'string', description: 'MDI iconset name.'},
	disabled: {type: 'boolean', default: false},
	modelValue: {type: 'string', description: 'powers v-model'},
	validation: {type: 'object'}
}
const events = {
	'update:modelValue': {}
}
const style = {
	'--input-shape': {type: 'enum', values: ['pill', 'rounded', 'squared'], default: 'pill'},
	'--input-size': {type: 'enum', values: ['normal', 'large', 'compact'], default: 'normal'},
}
</script>

# Input

<Showcase
	:editable="true"
	componentName="bunt-input"
	:slots="{}"
	:props="props"
	:style="style"
></Showcase>

## API

<ApiDocs :slots="slots" :props="props" :events="events" :style="style"/>
