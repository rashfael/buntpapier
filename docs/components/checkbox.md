---
title: checkbox
layout: 'component'
---

<script setup>
const slots = {
	default: {description: 'checkbox label'}
}
const props = {
	modelValue: {type: 'string', description: 'powers v-model'},
	type: {type: 'string', default: 'text', description: 'native input element type attribute'},
	label: {type: 'string', description: 'checkbox label, prefer to use default slot'},
	disabled: {type: 'boolean', default: false},
	readonly: {type: 'boolean', default: false},
}
const events = {
	'update:modelValue': {}
}
const style = {
	'--checkbox-size': {type: 'enum', values: ['normal', 'small'], default: 'normal'},
}
</script>

# Checkbox

<Showcase
	:editable="true"
	componentName="bunt-checkbox"
	:slots="{default: 'check me out!'}"
	:props="props"
	:style="style"
></Showcase>

## API

<ApiDocs :slots="slots" :props="props" :events="events" :style="style"/>
