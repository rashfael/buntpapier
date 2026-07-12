<script setup lang="ts">
// TODOs
// - maxHeight?
// - better hitbox
// - render selected option on options reactive change
// - class from outside
// - option background color contrast
// - selected option sticks when scrolling
// - open indicator broken
import { computed, defineComponent, h, nextTick, onMounted, onUnmounted, useSlots, watch, withModifiers } from 'vue'
import { useFloating, offset, flip, size } from '@floating-ui/vue'
import type { ReferenceElement, FloatingElement } from '@floating-ui/vue'
import { useComputedStyle } from '../computedStyle'
import { onThemeChange } from '../themeWatcher'
import { getIconClass } from '../utils/icon'
import { useInputOutline } from '../utils/input-outline'
import Scrollbars from './scrollbars.vue'

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
	validation,

	options,
	optionLabel,
	getOptionLabel,
	optionValue,
	getOptionValue,
	findOptionByValue,
	optionGroupLabel,
	optionGroupChildren,
	getOptionGroupLabel,
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
		default (value, { options, optionValue, optionGroupChildren }) {
			const matches = (option) => {
				if (typeof option === 'object' && optionValue)
					return option[optionValue] === value
				return option === value
			}

			for (const entry of options) {
				if (entry && typeof entry === 'object' && Array.isArray(entry[optionGroupChildren])) {
					const found = entry[optionGroupChildren].find(matches)
					if (found !== undefined) return found
				} else if (matches(entry)) {
					return entry
				}
			}
			return undefined
		}
	},
	optionGroupLabel: {
		type: String,
		default: 'label'
	},
	optionGroupChildren: {
		type: String,
		default: 'items'
	},
	getOptionGroupLabel: {
		type: Function,
		default (group, { optionGroupLabel }) {
			if (typeof group === 'object' && group[optionGroupLabel] !== undefined) {
				return group[optionGroupLabel]
			}
			return group
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

// the component renders a fragment (root element + teleported dropdown), so attributes
// like style/class can't auto-inherit — forward them onto the main element explicitly
defineOptions({ inheritAttrs: false })

const slots = useSlots()

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
	optionGroupLabel,
	optionGroupChildren,
	getOptionGroupLabel (group) {
		return getOptionGroupLabel(group, customizerArgs)
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

// grouped mode is enabled automatically when options carry a children array
const isGrouped = $computed(() => {
	return options.some(o => o && typeof o === 'object' && Array.isArray(o[optionGroupChildren]))
})

const filteredOptions = $computed(() => {
	if (!search) return options
	const lowercasedSearch = search.toLowerCase()
	const fuzzyFn = (a, b) => b.indexOf(a) !== -1
	return options.filter(option => filter(lowercasedSearch, option, fuzzyFn, customizerArgs))
})

const filteredGroups = $computed(() => {
	if (!isGrouped) return []
	if (!search) return options.map(group => ({ group, items: group[optionGroupChildren] }))
	const lowercasedSearch = search.toLowerCase()
	const fuzzyFn = (a, b) => b.indexOf(a) !== -1
	return options
		.map(group => {
			// a matching header keeps the whole group, otherwise filter its options
			const headerMatch = fuzzyFn(lowercasedSearch, String(getOptionGroupLabel(group, customizerArgs)).toLowerCase())
			const items = headerMatch
				? group[optionGroupChildren]
				: group[optionGroupChildren].filter(option => filter(lowercasedSearch, option, fuzzyFn, customizerArgs))
			return { group, items }
		})
		.filter(group => group.items.length)
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

// flat selectable-index model shared by flat + grouped rendering, drives keyboard nav
const displayGroups = $computed(() => {
	let selectableIndex = 0
	return filteredGroups.map(({ group, items }) => ({
		group,
		rows: items.map((option, i) => ({ option, group, isFirstOfGroup: i === 0, selectableIndex: selectableIndex++ }))
	}))
})

const flatRows = $computed(() => {
	return filteredOptions.map((option, i) => ({ option, group: undefined, isFirstOfGroup: false, selectableIndex: i }))
})

const selectableOptions = $computed(() => {
	return isGrouped ? displayGroups.flatMap(group => group.rows.map(row => row.option)) : filteredOptions
})

// --- keyboard navigation ---
let activeIndex = $ref(-1)
const optionEls = new Map() // selectableIndex -> li element

function setOptionRef (el, index) {
	if (el) optionEls.set(index, el)
	else optionEls.delete(index)
}

function onArrow (dir) {
	if (!open) {
		open = true
		return
	}
	const count = selectableOptions.length
	if (!count) return
	if (activeIndex < 0) activeIndex = dir > 0 ? 0 : count - 1
	else activeIndex = (activeIndex + dir + count) % count
	nextTick(() => optionEls.get(activeIndex)?.scrollIntoView({ block: 'nearest' }))
}

function onEnter () {
	if (open && activeIndex >= 0 && activeIndex < selectableOptions.length) {
		handleDropdownSelect(selectableOptions[activeIndex])
	}
}

watch($$(open), (isOpen) => {
	activeIndex = isOpen ? selectableOptions.findIndex(option => isOptionSelected(option)) : -1
})

watch($$(search), () => {
	activeIndex = selectableOptions.length ? 0 : -1
})

// single source of truth for an option <li>, reused by flat + grouped (slottable) rendering
function renderOptionLi (option, selectableIndex, group, isFirstOfGroup) {
	const selected = isOptionSelected(option)
	const active = selectableIndex === activeIndex
	return h('li', {
		key: selectableIndex,
		ref: el => setOptionRef(el, selectableIndex),
		class: ['bunt-select-option', { active: selected, highlighted: active }],
		onClick: withModifiers(() => handleDropdownSelect(option), ['prevent', 'stop']),
		onMousemove: () => { activeIndex = selectableIndex }
	}, slots.default
		? slots.default({ option, index: selectableIndex, selected, active, group, isFirstOfGroup })
		: [getOptionLabel(option, customizerArgs)])
}

// flat list rendered as a stateful component so highlight/selection stay reactive
const FlatOptions = defineComponent({
	name: 'BuntSelectOptions',
	setup () {
		return () => flatRows.map(row => renderOptionLi(row.option, row.selectableIndex, row.group, row.isFirstOfGroup))
	}
})

// per-group renderless component handed to the `group` slot so users wrap without re-looping;
// stateful + cached per original group object to keep identity stable and reactivity intact
const groupOptionsCache = new WeakMap()
function optionsComponentFor (group) {
	if (!groupOptionsCache.has(group)) {
		groupOptionsCache.set(group, defineComponent({
			name: 'BuntSelectGroupOptions',
			setup () {
				return () => {
					const entry = displayGroups.find(candidate => candidate.group === group)
					if (!entry) return []
					return entry.rows.map(row => renderOptionLi(row.option, row.selectableIndex, row.group, row.isFirstOfGroup))
				}
			}
		}))
	}
	return groupOptionsCache.get(group)
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
		// the dropdown's mirror strip must overlay the real input, so the pull-up
		// scales with the control height (normal 56px → -40/-52, compact 28px → -28/-40)
		offset(({ placement, rects }) => {
			const paddingTop = el ? parseFloat(getComputedStyle(el).paddingTop) || 0 : 0
			const bottom = paddingTop - rects.reference.height
			return placement === 'bottom' ? bottom : bottom - 12
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

// TODO watchEffect instead?
watch($$(modelValue), (newVal, oldVal) => {
	if (newVal === oldVal) return
	const option = findOptionByValue(newVal, customizerArgs)
	inputValue = getOptionLabel(option, customizerArgs)
}, { immediate: true })

watch($$(options), () => {
	customizerArgs.options = options
	const option = findOptionByValue(modelValue, customizerArgs)
	inputValue = getOptionLabel(option, customizerArgs)
}, { deep: true })

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

// The dropdown teleports to #bunt-teleport-target and therefore doesn't
// inherit the trigger's theme context — forward the resolved surface and
// color-scheme so the * derivation re-derives everything inside the menu.
let dropdownThemeStyle = $ref({})
function updateDropdownTheme () {
	if (!el || !open) return
	const computed = getComputedStyle(el as Element)
	dropdownThemeStyle = {
		'--clr-surface': computed.getPropertyValue('--_clr-surface'),
		colorScheme: computed.colorScheme
	}
}
watch($$(open), (isOpen) => {
	if (isOpen) updateDropdownTheme()
})
let unregisterThemeChange
onMounted(() => {
	unregisterThemeChange = onThemeChange(updateDropdownTheme)
})
onUnmounted(() => {
	unregisterThemeChange?.()
})

defineExpose({ el: $$(el) })
</script>
<template lang="pug">
.bunt-select.bunt-input(ref="el", v-resize-observer="updateOutline", v-bind="$attrs", :class="classes", :style="style", @click="handleClick")
	//- teleport(:to="dropdownInputTarget", :disabled="!dropdownInputTarget")
	.label-input-container
		.icon.mdi(v-if="icon", :class="[iconClass]")
		label
			span(v-show="!open") {{ label }}
			input(ref="inputEl", :type="type", :value="inputValue", :disabled="disabled", :readonly="readonly", :placeholder="placeholder", @input="handleInput($event)", @focus="handleFocus", @blur="handleBlur", @keydown.down.prevent="onArrow(1)", @keydown.up.prevent="onArrow(-1)", @keydown.enter.prevent="onEnter", @keydown.esc="open = false")
		.error-icon.mdi.mdi-alert-circle(v-show="invalid", :title="hintText")
		Outline(v-show="!open || dropdownPlacement === 'bottom'")
	//- .hint(v-if="hintIsHtml", v-html="hintText")
	.hint {{ hintText }}

teleport(v-if="open", to="#bunt-teleport-target")
	.bunt-select-dropdown-menu(ref="dropdownRef", :class="[dropdownClass, `dropdown-placement-${dropdownPlacement}`, ...classes]", :style="{ width: width+'px', ...dropdownFloatingStyles, ...style, ...dropdownThemeStyle }", @mousedown.prevent.stop="")
		.bunt-select.bunt-input(ref="dropdownInputTarget", :class="classes", :style="style")
			.label-input-container
				label
					span {{ label }}
			svg.dropdown-outline(:style="{'--label-gap': floatingLabelWidth}")
				path(:d="`M 0 1 h ${width}`")
		slot(name="result-header")
		Scrollbars.scrollable-menu(y="", :style="scrollableStyle")
			ul.bunt-select-groups(v-if="isGrouped")
				li.bunt-select-group(v-for="grp, gi of displayGroups", :key="gi")
					slot(name="group", :group="grp.group", :Options="optionsComponentFor(grp.group)", :options="grp.rows.map(row => row.option)")
						.bunt-select-group-header
							slot(name="group-header", :group="grp.group")
								| {{ getOptionGroupLabel(grp.group, customizerArgs) }}
						ul.bunt-select-group-options
							component(:is="optionsComponentFor(grp.group)")
			ul(v-else)
				component(:is="FlatOptions")
			ul(v-if="!selectableOptions.length")
				li.divider(transition="fade")
				li.text-center(transition="fade")
					slot(name="no-options") Sorry, no matching options.
</template>
<style lang="sass">
.bunt-select
	position: relative
	.open-indicator
		position: absolute
		right: 4px
		color: var(--clr-text-secondary)
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
	&.bunt-input--size-compact .bunt-input
		height: 28px
	.scrollable-menu
		pointer-events: auto
		display: flex
		flex-direction: column
		flex: auto
		min-height: 0
		background-color: var(--_clr-surface-raised)

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
		color: var(--clr-text)
		& + li
			margin-top: 0 // override vitepress
		&:hover
			background-color: var(--clr-fill-hover)
		&.highlighted
			background-color: var(--clr-primary)
			color: var(--clr-on-primary)
	// group container is a layout wrapper, not a selectable row
	.bunt-select-group
		height: auto
		line-height: normal
		padding: 0
		cursor: default
		overflow: visible
		white-space: normal
		&:hover
			background-color: transparent
	ul.bunt-select-group-options
		margin: 0
		padding: 0
	.bunt-select-group-header
		font-family: var(--font-stack)
		height: 32px
		line-height: 32px
		padding: 0 8px
		font-size: 12px
		font-weight: 600
		text-transform: uppercase
		letter-spacing: 0.04em
		color: var(--clr-text-secondary)
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis
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
				// follows the resolved text color (same treatment as the input outline)
				stroke: color-mix(in srgb, currentcolor 44%, transparent)
				stroke-width: 1px
		.scrollable-menu
			border-bottom: none
			border-radius: var(--bunt-input--radius-px) var(--bunt-input--radius-px) 0 0
	&.bunt-input--shape-pill .bunt-scroll-content
		li.bunt-select-option
			padding-left: 24px
		.bunt-select-group-header
			padding-left: 24px
</style>
