<script setup lang="ts">
// TODO
// - take array as value
// - custom true/false values
// - validation
// - indeterminate
// - icon
// - use icon for the whole checkbox?
import { Comment, Fragment, Text, useTemplateRef, useSlots } from 'vue'
import type { VNode } from 'vue'
import { useFieldRouting, useFieldFocus } from '../utils/field'
import { useComputedStyle } from '../computedStyle'
import { ensureReadable } from '../utils/colors'

const {
	modelValue,
	label,
	disabled
} = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	label: String,
	disabled: {
		type: Boolean,
		default: false
	}
})
const emit = defineEmits<{
	'update:modelValue': [value: boolean]
	input: [event: Event]
	change: [event: Event]
	focus: []
	blur: []
}>()
defineOptions({ inheritAttrs: false })
defineSlots<{ label?(): unknown, default?(): unknown }>()
const slots = useSlots()
const el = useTemplateRef<HTMLElement>('el')
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')
const { id, rootAttrs, inputAttrs } = useFieldRouting()
const { focus } = useFieldFocus(el, inputEl, event => {
	if (event === 'focus') emit('focus')
	else emit('blur')
})

// Slot functions exist even when their content is conditionally absent, so an empty slot
// counts as no label and leaves naming to an external label.
function rendersContent (nodes: VNode[]) {
	return nodes.some(node => {
		if (node.type === Comment) return false
		if (node.type === Text) return String(node.children).trim() !== ''
		if (node.type === Fragment) return rendersContent(node.children as VNode[])
		return true
	})
}

// #label wins over a nonempty label prop, which wins over the default slot.
function labelSource () {
	if (slots.label && rendersContent(slots.label() as VNode[])) return 'slot'
	if (label?.trim()) return 'prop'
	if (slots.default && rendersContent(slots.default() as VNode[])) return 'default'
}

// Checked state comes from the model; a caller aria-checked would contradict it.
function controlAttrs () {
	const attrs: Record<string, unknown> = inputAttrs(undefined, Boolean(labelSource()))
	delete attrs['aria-checked']
	return attrs
}

// A disabled checkbox stays focusable, so native disabling is replaced by cancelling the click
// that label clicks, Space and scripted click() all go through. Cancelling it restores the
// checked state and suppresses input and change. If a caller stops or cancels the click's
// propagation before this guard runs, the toggle is reverted on change and its events are
// not forwarded.
function onClick ($event: MouseEvent) {
	if (disabled) $event.preventDefault()
}

function onInput ($event: Event) {
	if (!disabled) emit('input', $event)
}

function onChange ($event: Event) {
	const target = $event.target as HTMLInputElement
	if (disabled) {
		target.checked = modelValue
		return
	}
	// Update the model first, so a change listener reads the new value, as with native v-model.
	emit('update:modelValue', target.checked)
	emit('change', $event)
}

const { classes, style, customProps } = useComputedStyle(el, {
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
		const guarded = ensureReadable(color, surface, 3, el.value)
		if (guarded) style['--_checkbox-ink-color'] = guarded.string()
	}
	return { style, classes }
})

const icon = $computed(() => customProps.icon || 'check')

defineExpose({ el, focus })
</script>
<template lang="pug">
.bunt-checkbox(ref="el", v-bind="rootAttrs()", :class="[...classes, {checked: modelValue, disabled}]", :style="style")
	label(:for="id()")
		input(
			ref="inputEl",
			v-bind="controlAttrs()",
			type="checkbox",
			:checked="modelValue",
			:aria-disabled="disabled || undefined",
			@click="onClick",
			@input="onInput",
			@change="onChange",
			@keydown.enter="disabled && $event.preventDefault()"
		)
		.bunt-checkbox-box(aria-hidden="true")
			.mdi(:class="[`mdi-${icon}`]")
		span.bunt-checkbox-label(v-if="labelSource()", :id="`${id()}-label`")
			slot(v-if="labelSource() === 'slot'", name="label")
			template(v-else-if="labelSource() === 'prop'") {{ label }}
			slot(v-else)
</template>
