---
title: select
layoutClass: 'component'
---

<script setup>
import { ref } from 'vue'

const slots = {
}
const props = {
	modelValue: {type: 'string', description: 'powers v-model'},
	options: {type: 'array', value: ['Option 1', 'Option 2', 'Option 3'], description: 'Array of strings or objects. If objects, they must have a `label` and `value` property.'},
	label: {type: 'string', value: 'Label'},
}
const events = {
	click: {}
}
const style = {
	'--input-shape': {type: 'enum', values: ['pill', 'rounded', 'squared'], default: 'pill'},
	'--input-size': {type: 'enum', values: ['normal', 'large', 'compact'], default: 'normal'},
}

// Grouped options: each entry has a label and a nested `items` array.
const groupedOptions = [
	{ label: 'Fruits', items: ['Apple', 'Banana', 'Cherry'] },
	{ label: 'Vegetables', items: ['Carrot', 'Potato', 'Pumpkin'] },
	{ label: 'Drinks', items: [
		{ label: 'Coffee', value: 'coffee' },
		{ label: 'Tea', value: 'tea' }
	] }
]

const groupedValue = ref(null)
const slottedValue = ref(null)
</script>

# Select

## Playground

<Showcase
	:editable="true"
	componentName="bunt-select"
	:slots="{}"
	:props="props"
	:style="style"
></Showcase>

## Grouped options

Pass a nested structure where each entry has a label (`optionGroupLabel`, default `label`) and a children array (`optionGroupChildren`, default `items`). Grouped mode is detected automatically — flat option arrays keep working unchanged. Group headers are not selectable. When filtering, a group is hidden once all its options are filtered out; typing text that matches a **header** keeps that whole group.

Keyboard navigation works in both modes: <kbd>↑</kbd>/<kbd>↓</kbd> move between options (skipping headers), <kbd>Enter</kbd> selects, <kbd>Esc</kbd> closes.

<bunt-select label="Group demo" :options="groupedOptions" v-model="groupedValue" style="--input-shape: rounded; width: 280px" />

Selected value: `{{ groupedValue }}`

### Customizing groups with the `group` slot

The `group` slot wraps each group. It receives the `group` object and a renderless `Options` component — drop `<component :is="Options" />` wherever the options should render, no manual loop required. The per-option default slot still applies inside your wrapper.

```pug
bunt-select(:options="groupedOptions" v-model="value")
	template(#group="{ group, Options }")
		section.my-group
			h4 {{ group.label }}
			component(:is="Options")
```

<bunt-select label="Group slot demo" :options="groupedOptions" v-model="slottedValue" style="--input-shape: rounded; width: 280px">
	<template #group="{ group, Options }">
		<div style="padding: 4px 8px; font-weight: 700; color: var(--clr-primary)">— {{ group.label }} —</div>
		<component :is="Options" />
	</template>
</bunt-select>

Selected value: `{{ slottedValue }}`

For lighter customization, override just the `group-header` slot (receives `group`) to restyle the header while keeping the default option list.



<div id="bunt-teleport-target"></div>
