<script setup lang="ts">
// TODO
// - take array as value
// - custom true/false values
// - validation
// - indeterminate
// - disabled + readonly styling
// - icon
// - use icon for the whole checkbox?
import { useComputedStyle } from '../computedStyle'
import { ensureReadable } from '../utils/colors'

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
	'--_clr-surface': 'surface',
}, ({ size, weight, color, surface }) => {
	const style = {}
	const classes = []

	if (size) classes.push(`bunt-checkbox--size-${size}`)
	if (weight) classes.push(`bunt-checkbox--weight-${weight}`)
	// outlined weight uses the accent as ink — contrast-guard it against the
	// surface (the filled check color comes from contrast-color() in CSS)
	if (weight === 'outlined' && color && surface) {
		try {
			const guarded = ensureReadable(color, surface, 3)
			if (guarded) style['--_checkbox-ink-color'] = guarded.string()
		} catch (e) {
			console.error('Could not parse color', e)
		}
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
