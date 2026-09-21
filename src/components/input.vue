<script setup lang="ts">
// TODO
// - label animation WITH icon should go sideways, hint with icon should be on same height as input
// - rethink padding-top
import { useTemplateRef, useSlots, watch } from 'vue'
import type { PropType } from 'vue'
import { useFieldRouting, useFieldFocus, preventFieldEdit } from '../utils/field'
import { useComputedStyle } from '../computedStyle'
import { getIconClass } from '../utils/icon'
import { useInputOutline } from '../utils/input-outline'

// pill radius must track the control height (≈ half), so it's keyed by size
const INPUT_SHAPE_RADII = {
	normal: { squared: 0, rounded: 4, pill: 17.5 },
	compact: { squared: 0, rounded: 4, pill: 14 }
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
		type: String as PropType<'text' | 'search' | 'email' | 'url' | 'tel' | 'password' | 'number'>,
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
const emit = defineEmits<{
	'update:modelValue': [value: string | number]
	input: [event: Event]
	change: [event: Event]
	focus: []
	blur: []
}>()
defineOptions({ inheritAttrs: false })
defineSlots<{ hint?(): unknown }>()
const slots = useSlots()
const el = useTemplateRef<HTMLElement>('el')
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')
const { id, rootAttrs, inputAttrs } = useFieldRouting()
const { focused, focus } = useFieldFocus(el, inputEl, event => {
	if (event === 'focus') emit('focus')
	else emit('blur')
	if (event === 'blur' && validation) validation.$touch()
})
function hasHint () {
	return Boolean(invalid ? hintText : slots.hint || hint)
}

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

function onInput ($event: Event) {
	emit('input', $event)
	if (disabled || readonly) {
		($event.target as HTMLInputElement).value = String(modelValue ?? '')
		return
	}
	emit('update:modelValue', ($event.target as HTMLInputElement).value)
	if (validation) validation.$touch()
}

let radius = $ref(4)

const { Outline, updateOutline } = useInputOutline($$(label), $$(radius))

watch($$(radius), (newVal, oldVal) => {
	if (newVal === oldVal) return
	updateOutline()
})

const { classes, style } = useComputedStyle(el, {
	'--input-shape': 'shape',
	'--input-size': 'size',
	'--input-layout': 'layout'
}, ({ shape, size, layout }) => {
	const style = {}
	const classes = []

	if (shape) {
		classes.push(`bunt-input--shape-${shape}`)
		radius = (INPUT_SHAPE_RADII[size] || INPUT_SHAPE_RADII.normal)[shape] ?? 0
	}
	if (size) classes.push(`bunt-input--size-${size}`)
	if (layout) classes.push(`bunt-input--layout-${layout}`)

	return { style, classes }
})

defineExpose({ el, focus })
</script>
<template lang="pug">
.bunt-input(ref="el", v-resize-observer="updateOutline", v-bind="rootAttrs()", :class="[...classes, {focused, 'floating-label': floatingLabel, invalid, disabled, 'with-icon': icon}]", :style="style")
	.label-input-container
		.icon.mdi(v-if="icon", :class="[iconClass]")
		label(:for="id()")
			span(:id="`${id()}-label`") {{ label }}
			input(
				ref="inputEl",
				v-bind="inputAttrs(hasHint() ? `${id()}-hint` : undefined, label)",
				:type="type",
				:value="modelValue",
				:readonly="readonly || disabled",
				:aria-disabled="disabled || undefined",
				:aria-readonly="readonly || disabled || undefined",
				:aria-invalid="invalid || undefined",
				:placeholder="placeholder",
				@input="onInput",
				@change="emit('change', $event)",
				@beforeinput="preventFieldEdit($event, disabled || readonly)",
				@paste="preventFieldEdit($event, disabled || readonly)",
				@drop="preventFieldEdit($event, disabled || readonly)",
				@keydown.enter="disabled && $event.preventDefault()"
			)
		.error-icon.mdi.mdi-alert-circle(v-show="invalid", :title="hintText")
		Outline
	.hint(v-if="hasHint()", :id="`${id()}-hint`")
		template(v-if="invalid") {{ hintText }}
		slot(v-else, name="hint") {{ hint }}
</template>
