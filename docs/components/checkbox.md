---
title: checkbox
layoutClass: 'component'
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
	'--checkbox-weight': {type: 'enum', values: [/* 'elevated', */ 'filled', 'outlined', 'text'], default: 'filled'},
	'--checkbox-icon': {type: 'enum', values: ['check', 'check-bold', 'close', 'plus', 'minus'], default: 'check'},
	'--checkbox-color': {type: 'color', default: 'var(--clr-primary)', computed: '--_checkbox-color'},
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

## Examples

### Size

<Showcase
	componentName="bunt-checkbox"
	:slots="{default: 'small'}"
	:props="{}"
	:style="{'--checkbox-size': {type: 'enum', value: 'small'}}"
></Showcase>

<Showcase
	componentName="bunt-checkbox"
	:slots="{default: 'normal'}"
	:props="{}"
	:style="{'--checkbox-size': {type: 'enum', value: 'normal'}}"
></Showcase>
