---
title: input
layoutClass: 'component'
---

<script setup>
const slots = {
	hint: {description: 'If you want to render rich text in the hint, use this, otherwise, use the `hint` prop; overridden by validation messages'}
}
const props = {
	type: {type: 'string', default: 'text', description: 'native input element type attribute, supports text, search, email, url, tel, password and number'},
	label: {type: 'string', value: 'label'},
	placeholder: {type: 'string'},
	hint: {type: 'string'},
	icon: {type: 'string', description: 'MDI iconset name.'},
	disabled: {type: 'boolean', default: false, description: 'Prevents editing and form submission with Enter, but you can still focus the input'},
	readonly: {type: 'boolean', default: false, description: 'Prevents editing, but you can still focus the input and copy its text'},
	modelValue: {type: 'string | number', description: 'powers v-model, user input is always emitted as a string'},
	validation: {type: 'object'}
}
const events = {
	'update:modelValue': {description: 'The new input value, always a string'},
	input: {description: 'native input event'},
	change: {description: 'native change event'},
	focus: {},
	blur: {}
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

| Exposed member | Description |
|---|---|
| `focus(options?: FocusOptions): void` | Focuses the input, even when disabled. Does nothing if the input is hidden, inert or unmounted. |
| `el` | Component root element. |
