---
title: checkbox
layoutClass: 'component'
---

<script setup>
const slots = {
	label: {description: 'Inline label markup; overrides the `label` prop and the default slot'},
	default: {description: 'Label content used when neither `#label` nor a nonempty `label` prop is given'}
}
const props = {
	modelValue: {type: 'boolean', default: false, description: 'powers v-model'},
	label: {type: 'string', description: 'Label text; overrides the default slot'},
	disabled: {type: 'boolean', default: false, description: 'Prevents toggling and form submission with Enter, but you can still focus the checkbox'},
}
const events = {
	'update:modelValue': {description: 'The new checked state'},
	input: {description: 'native input event'},
	change: {description: 'native change event'},
	focus: {},
	blur: {}
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

| Exposed member | Description |
|---|---|
| `focus(options?: FocusOptions): void` | Focuses the checkbox, even when disabled. Does nothing if the checkbox is hidden, inert or unmounted. |
| `el` | Component root element. |

`readonly` is no longer supported: a native checkbox ignores it.

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
