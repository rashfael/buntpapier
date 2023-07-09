<script setup lang="ts">
// TODO
// - label animation WITH icon should go sideways, hint with icon should be on same height as input
// - apply name and other attrs to input el
import { ref, watch } from 'vue'
import { useComputedStyle } from '../computedStyle'
import { getIconClass } from '../utils/icon'
import { useInputOutline } from '../utils/input-outline'

const INPUT_SHAPE_RADII = {
	squared: 0,
	rounded: 4,
	pill: 17.5
}

const {
	type,
	label,
	placeholder,
	modelValue,
	disabled,
	readonly,
	icon,
	iconRight,
	hint,
	validation
} = defineProps({
	type: {
		type: String,
		default: 'text'
	},
	label: String,
	placeholder: String,
	modelValue: {
		type: [String, Number],
		default: ''
	},
	disabled: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	},
	icon: String,
	iconRight: {
		type: Boolean,
		default: false
	},
	hint: String,
	validation: Object // vuelidate result
})
const emit = defineEmits(['update:modelValue'])

let focused = $ref(false)

const iconClass = $computed(() => {
	return getIconClass(icon)
})

const invalid = $computed(() => {
	return validation && validation.$error
})

const hintText = $computed(() => {
	if (invalid && validation.$error) {
		const errorMessages = validation.$errors.map(error => error.$message)
		return errorMessages.filter(Boolean).join()
	}
	return hint
})

const floatingLabel = $computed(() => {
	return Boolean(placeholder || modelValue || modelValue === 0)
})

function onInput ($event) {
	emit('update:modelValue', $event.target.value)
	if (validation) validation.$touch()
}

function onBlur () {
	focused = false
	if (validation) validation.$touch()
}

let radius = $ref(4)

const { Outline, updateOutline } = useInputOutline($$(label), $$(radius))

watch($$(radius), (newVal, oldVal) => {
	if (newVal === oldVal) return
	updateOutline()
})

const el = ref()
const { classes, style } = useComputedStyle(el, {
	'--input-shape': 'shape',
	'--input-size': 'size'
}, ({ shape, size }) => {
	const style = {}
	const classes = []

	if (shape) {
		classes.push(`bunt-input--shape-${shape}`)
		radius = INPUT_SHAPE_RADII[shape] || 0
	}
	if (size) classes.push(`bunt-input--size-${size}`)

	return { style, classes }
})

</script>
<template lang="pug">
.bunt-input(ref="el", :class!="[...classes, {focused, 'floating-label': floatingLabel, invalid, disabled: disabled, 'with-icon': icon}]", :style="style", v-resize-observer="updateOutline")
	.label-input-container
		.icon.mdi(v-if="icon", :class="[iconClass]")
		label
			span {{ label }}
			input(:type="type", :value="modelValue", :disabled="disabled", :readonly="readonly", @input="onInput($event)", @focus="focused = true", @blur="onBlur", :placeholder="placeholder")
		.error-icon.mdi.mdi-alert-circle(v-show="invalid", :title="hintText")
		Outline
	//- .hint(v-if="hintIsHtml", v-html="hintText")
	.hint {{ hintText }}
</template>
<style lang="stylus">
</style>
