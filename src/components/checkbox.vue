<script setup lang="ts">
// TODO
// - take array as value
// - custom true/false values
// - validation
// - indeterminate
// - disabled + readonly styling
// - icon
// - use icon for the whole checkbox?
import Color from 'color'
import { useComputedStyle } from '../computedStyle'
import { firstReadable, CLR_PRIMARY_TEXT } from '../utils/colors'

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
const { classes, style, customProps } = useComputedStyle($$(el), {
	'--checkbox-size': 'size',
	'--checkbox-icon': 'icon',
	'--checkbox-weight': 'weight',
	'--_checkbox-color': 'color',
}, ({ size, weight, color }) => {
	const style = {}
	const classes = []

	if (size) classes.push(`bunt-checkbox--size-${size}`)
	if (weight) classes.push(`bunt-checkbox--weight-${weight}`)
	if (color) {
		style['--_checkbox-check-color'] = firstReadable([CLR_PRIMARY_TEXT.DARK, CLR_PRIMARY_TEXT.LIGHT], color, 3)
	}
	return { style, classes }
})

const icon = $computed(() => customProps.icon || 'check')

defineExpose({ el: $$(el) })
</script>
<template lang="pug">
.bunt-checkbox(ref="el", :class="[...classes, {checked: modelValue, disabled}]", :style="style")

	label
		.bunt-checkbox-box
			.mdi(:class="[`mdi-${icon}`]")
		span(v-if="label") {{ label }}
		slot(v-else)
		input(type="checkbox", :name="name", :checked="modelValue", :disabled="disabled", :readonly="readonly", @change="onChange($event)", @focus="focused = true", @blur="onBlur")
</template>
<style lang="stylus">
</style>
