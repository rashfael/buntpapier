<script setup lang="ts">
// TODO
// - take array as value
// - custom true/false values
// - validation
// - indeterminate
// - disabled + readonly styling
// - icon
// - use icon instead of ::after hack
import { useComputedStyle } from '../computedStyle'

const {
	modelValue,
	name,
	label,
	disabled,
	readonly
} = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	name: String,
	label: String,
	disabled: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:modelValue'])

let focused = $ref(false)

const onChange = ($event) => {
	emit('update:modelValue', $event.target.checked)
	// if (this.validation) this.validation.$touch()
}

const onBlur = () => {
	focused = false
}

const el = $ref()
const { classes, style } = useComputedStyle($$(el), {
	'--checkbox-size': 'size'
}, ({ size }) => {
	const style = {}
	const classes = []

	if (size) classes.push(`bunt-checkbox--size-${size}`)

	return { style, classes }
})
</script>
<template lang="pug">
.bunt-checkbox(ref="el", :class="[...classes, {checked: modelValue, disabled}]", :style="style")

	label
		.bunt-checkbox-box
		span(v-if="label") {{ label }}
		slot(v-else)
		input(type="checkbox", :name="name", :checked="modelValue", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
</template>
<style lang="stylus">
</style>
