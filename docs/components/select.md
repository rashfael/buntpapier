---
title: select
layoutClass: 'component'
---

<script setup>
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






<div id="bunt-teleport-target"></div>
