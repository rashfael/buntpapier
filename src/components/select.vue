<script setup lang="ts">
// TODOs
// - maxHeight?
// - better hitbox
import { computed, nextTick, ref, watch } from 'vue'
import { useFloating, offset, flip, size } from '@floating-ui/vue'
import type { ReferenceElement, FloatingElement } from '@floating-ui/vue'
import { useComputedStyle } from '../computedStyle'
import { getIconClass } from '../utils/icon'
import { useInputOutline } from '../utils/input-outline'
import Scrollbars from './scrollbars.vue'

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
	validation,

	options,
	optionLabel,
	getOptionLabel,
	optionValue,
	getOptionValue,
	findOptionByValue,
	filter
} = defineProps({
	type: {
		type: String,
		default: 'text'
	},
	label: String,
	placeholder: String,
	modelValue: {
		type: [String, Object, Number],
		default: null
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
	validation: Object, // vuelidate result

	options: {
		type: Array,
		default () {
			return []
		},
	},
	optionLabel: {
		type: String,
		default: 'label'
	},
	getOptionLabel: {
		type: Function,
		default (option, { optionLabel }) {
			if (typeof option === 'object') {
				if (optionLabel !== undefined && option[optionLabel] !== undefined) {
					return option[optionLabel]
				}
			}
			return option
		}
	},
	optionValue: {
		type: String,
		default: 'value'
	},
	getOptionValue: {
		type: Function,
		default (option, { optionValue }) {
			if (typeof option === 'object') {
				if (optionValue !== undefined && option[optionValue] !== undefined) {
					return option[optionValue]
				}
			}
			return option
		}
	},
	findOptionByValue: {
		type: Function,
		default (value, { options, optionValue }) {
			const findFunc = (option) => {
				if (typeof option === 'object' && optionValue)
					return option[optionValue] === value
				return option === value
			}

			return options.find(findFunc)
		}
	},
	dropdownClass: String,
	dropdownOverflowElement: [String, Object],
	filter: {
		type: Function,
		default (lowercasedSearch, option, fuzzyFn, { getOptionLabel }) {
			return fuzzyFn(lowercasedSearch, getOptionLabel(option).toLowerCase())
		}
	}
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

// customizers can't access other non-raw props so we need to pass them explicitly
const customizerArgs = {
	options,
	optionLabel,
	getOptionLabel (option) {
		return getOptionLabel(option, customizerArgs)
	},
	optionValue,
	getOptionValue (option) {
		return getOptionValue(option, customizerArgs)
	},
	filter
}

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

let open = $ref(false)
let width = $ref(0)
let dropdownReady = $ref(false)
const el = $ref<ReferenceElement>(null)
const inputEl: HTMLInputElement = $ref(null)
const dropdownRef = $ref<FloatingElement>(null)
const dropdownInputTarget = $ref(null)

async function handleFocus () {
	open = true
	width = el.getBoundingClientRect().width
	inputEl.select()
	await nextTick()
	focused = true
}

async function handleBlur () {
	open = false
	if (validation) validation.$touch()
	dropdownReady = false
	await nextTick()
	focused = false
	updateOutline()
}

async function handleClick () {
	if (open || !focused) return
	open = true
	updateOutline()
}

let inputValue = $ref('')
let search = $ref('')

function handleInput ($event) {
	inputValue = $event.target.value
	search = inputValue
	// emit('update:modelValue', $event.target.value)
	// if (validation) validation.$touch()
}

const filteredOptions = $computed(() => {
	if (!search) return options
	const lowercasedSearch = search.toLowerCase()
	const fuzzyFn = (a, b) => b.indexOf(a) !== -1
	return options.filter(option => filter(lowercasedSearch, option, fuzzyFn, customizerArgs))
})

function isOptionSelected (option) {
	return getOptionValue(option, customizerArgs) === modelValue
}

function handleDropdownSelect (option) {
	const value = getOptionValue(option, customizerArgs)
	inputValue = getOptionLabel(option, customizerArgs)
	emit('update:modelValue', value)
	open = false
	updateOutline()
}

let dropdownMaxHeight = $ref(512)
const scrollableStyle = $computed(() => {
	return {
		maxHeight: dropdownMaxHeight - 52 + 'px'
	}
})

const { floatingStyles: dropdownFloatingStyles, placement: dropdownPlacement, isPositioned } = useFloating($$(el), $$(dropdownRef), {
	open: $$(open),
	placement: 'bottom',
	middleware: [
		offset(({ placement }) => {
			return placement === 'bottom' ? -40 : -52
		}),
		flip(),
		size({
			apply ({ availableHeight }) {
				dropdownMaxHeight = availableHeight
			}
		})
	]
})

let radius = $ref(4)

const { Outline, updateOutline, floatingLabelWidth } = useInputOutline($$(label), $$(radius), {
	bottom: computed(() => dropdownPlacement.value === 'bottom' && open)
})

watch($$(modelValue), (newVal, oldVal) => {
	if (newVal === oldVal) return
	const option = findOptionByValue(newVal, customizerArgs)
	inputValue = getOptionLabel(option, customizerArgs)
}, { immediate: true })

watch($$(radius), (newVal, oldVal) => {
	if (newVal === oldVal) return
	updateOutline()
})

watch(isPositioned, async (isPositioned) => {
	if (!isPositioned) return
	await nextTick()
	updateOutline()
})

const { classes: computedClasses, style: computedStyle } = useComputedStyle($$(el), {
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
	style['--bunt-input--radius'] = `${radius}px`

	return { style, classes }
})

const classes = $computed(() => {
	return [
		...computedClasses,
		{
			focused,
			'floating-label': floatingLabel,
			invalid,
			disabled,
			'with-icon': icon,
			'with-icon-right': iconRight,
			open
		}
	]
})

const style = $computed(() => {
	return {
		...computedStyle,
		'--bunt-input--radius': `${radius}`
	}
})

defineExpose({ el: $$(el) })
</script>
<template lang="pug">
.bunt-select.bunt-input(ref="el", v-resize-observer="updateOutline", :class="classes", :style="style", @click="handleClick")
	//- teleport(:to="dropdownInputTarget", :disabled="!dropdownInputTarget")
	.label-input-container
		.icon.mdi(v-if="icon", :class="[iconClass]")
		label
			span(v-show="!open") {{ label }}
			input(ref="inputEl", :type="type", :value="inputValue", :disabled="disabled", :readonly="readonly", :placeholder="placeholder", @input="handleInput($event)", @focus="handleFocus", @blur="handleBlur")
		.error-icon.mdi.mdi-alert-circle(v-show="invalid", :title="hintText")
		Outline(v-show="!open || dropdownPlacement === 'bottom'")
	//- .hint(v-if="hintIsHtml", v-html="hintText")
	.hint {{ hintText }}

teleport(v-if="open", to="#bunt-teleport-target")
	.bunt-select-dropdown-menu(ref="dropdownRef", :class="[dropdownClass, `dropdown-placement-${dropdownPlacement}`, ...classes]", :style="{ width: width+'px', ...dropdownFloatingStyles, ...style }", @mousedown.prevent.stop="")
		.bunt-select.bunt-input(ref="dropdownInputTarget", :class="classes", :style="style")
			.label-input-container
				label
					span {{ label }}
			svg.dropdown-outline(:style="{'--label-gap': floatingLabelWidth}")
				path(:d="`M 0 1 h ${width}`")
		slot(name="result-header")
		Scrollbars.scrollable-menu(y="", :style="scrollableStyle")
			ul
				li(v-for="option, index of filteredOptions", :key="index", :class="{ active: isOptionSelected(option),}", @click.prevent.stop="handleDropdownSelect(option)")
					slot(:option="option")
						| {{ getOptionLabel(option, customizerArgs) }}
				li.divider(v-if="!filteredOptions.length", transition="fade")
				li.text-center(v-if="!filteredOptions.length" transition="fade")
					slot(name="no-options") Sorry, no matching options.
</template>
<style lang="sass">
.bunt-select
	position: relative
	.open-indicator
		position: absolute
		right: 4px
		color: var(--clr-secondary-text-light)
		font-size: 28px
		line-height: 20px
		top: 8px
		transition: all 0.25s ease-in-out
		cursor: pointer
	&.open .open-indicator
		transform-origin: center
		transform: rotate(180deg)
	.bunt-input input
		padding-right: 20px
.bunt-select-dropdown-menu
	// card()
	--bunt-input--radius-px: calc(1px * var(--bunt-input--radius))
	border-radius: var(--bunt-input--radius-px)
	box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)
	transition: box-shadow .3s
	z-index: 100
	display: flex
	flex-direction: column
	pointer-events: none
	.bunt-input
		padding-top: 0
		height: 34px
	.scrollable-menu
		pointer-events: auto
		display: flex
		flex-direction: column
		flex: auto
		min-height: 0
		background-color: var(--clr-white)

	ul
		margin: 0
		padding: 0
	li
		font-family: var(--font-stack)
		list-style-type: none
		height: 32px
		padding: 0 8px 0 0
		margin: 0
		line-height: 32px
		text-overflow: ellipsis
		overflow: hidden
		white-space: nowrap
		cursor: pointer
		& + li
			margin-top: 0 // override vitepress
		&:hover
			background-color: var(--clr-primary)
		// TODO define proper select colors
	&.dropdown-placement-bottom
		// padding-top: 37px
		.scrollable-menu
			border: 2px solid var(--clr-primary)
			border-top: none
			border-radius: 0 0 var(--bunt-input--radius-px) var(--bunt-input--radius-px)
	&.dropdown-placement-top
		flex-direction: column-reverse
		border: 2px solid var(--clr-primary)
		.bunt-input
			label
				z-index: 1
			svg.dropdown-outline
				stroke-dasharray: calc(var(--bunt-input--radius) + 3) var(--label-gap) 10000
				stroke: var(--clr-disabled-text-light)
				stroke-width: 1px
		.scrollable-menu
			border-bottom: none
			border-radius: var(--bunt-input--radius-px) var(--bunt-input--radius-px) 0 0
	&.bunt-input--shape-pill .bunt-scroll-content li
		padding-left: 24px
</style>
