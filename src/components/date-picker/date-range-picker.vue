<script setup lang="ts">
import { nextTick, onBeforeUnmount, useId, useSlots, useTemplateRef, watch } from 'vue'
import { useComputedStyle } from '../../computedStyle'
import { usePickerField } from './picker-field'
import { useInputOutline } from '../../utils/input-outline'
import CalendarPanel from './CalendarPanel.vue'
import {
	Temporal,
	type WeekStart,
	type DateRange,
	type DatePreset,
	startOfMonth,
	sameDay,
	sameMonth,
	sameYear,
	formatD,
	formatDM,
	formatDMY,
	getLocaleWeekStart
} from './temporal'

const INPUT_SHAPE_RADII = {
	squared: 0,
	rounded: 4,
	pill: 17.5
}

const {
	modelValue,
	placeholder,
	disabled,
	readonly,
	label,
	hint,
	minDate,
	maxDate,
	disabledDates,
	monthsToShow = 2,
	weekStartsOn: weekStartsOnProp,
	locale,
	showWeekNumbers = false,
	inline = false,
	navigateOnOutsideDayClick = true,
	presets,
	formatRange
} = defineProps<{
	modelValue?: DateRange
	placeholder?: string
	disabled?: boolean
	readonly?: boolean
	label?: string
	hint?: string
	minDate?: Temporal.PlainDate
	maxDate?: Temporal.PlainDate
	disabledDates?: (d: Temporal.PlainDate) => boolean | { disabled: boolean; reason?: string }
	monthsToShow?: number
	weekStartsOn?: WeekStart
	locale?: string
	showWeekNumbers?: boolean
	inline?: boolean
	navigateOnOutsideDayClick?: boolean
	presets?: DatePreset<DateRange>[]
	formatRange?: (r: DateRange) => string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: DateRange]
	focus: []
	blur: []
}>()
defineOptions({ inheritAttrs: false })
defineSlots<{ hint?(): unknown }>()
const slots = useSlots()
const locked = $computed(() => disabled || readonly)

const weekStartsOn = $computed(() => weekStartsOnProp ?? getLocaleWeekStart(locale))

let currentMonth = $ref<Temporal.PlainDate>(
	(modelValue?.start ? startOfMonth(modelValue.start) : null)
	?? Temporal.Now.plainDateISO().with({ day: 1 })
)
let focusedDay = $ref<Temporal.PlainDate | null>(modelValue?.start ?? Temporal.Now.plainDateISO())
let open = $ref(false)

// Selection state machine
let anchor = $ref<Temporal.PlainDate | null>(null)
let hoverDay = $ref<Temporal.PlainDate | null>(null)
const selecting = $computed(() => anchor !== null)

const el = $ref<HTMLElement>(null)
const inputEl = $ref<HTMLInputElement>(null)
const clearEl = $ref<HTMLElement>(null)
const popoverEl = $ref<HTMLElement>(null)
const calendar = $ref<InstanceType<typeof CalendarPanel>>(null)
const popoverId = `bunt-date-range-picker-popover-${useId()}`

// ── Field wiring ─────────────────────────────────────────

// closePopover also cancels an unfinished range selection, so a disable while open drops it.
const { id, rootAttrs, controlAttrs, hasHint, tabbableDays, groupTabindex, focused, focus, focusCalendar } = $(usePickerField({
	root: $$(el),
	input: $$(inputEl),
	calendar: $$(calendar),
	popover: $$(popoverEl),
	inline: () => inline,
	disabled: () => disabled,
	open: () => open,
	label: () => label,
	hint: () => hint,
	hintSlot: () => Boolean(slots.hint),
	close: (returnFocus) => closePopover(returnFocus),
	// The typed emit takes a literal, not a union-typed variable.
	emit: (event) => event === 'focus' ? emit('focus') : emit('blur')
}))

const clearVisible = $computed(() => !locked && Boolean(modelValue?.start || modelValue?.end))

// ── Day classification ──────────────────────────────────────────────────────

function isDayDisabled (d: Temporal.PlainDate): boolean {
	if (disabled) return true
	if (minDate && Temporal.PlainDate.compare(d, minDate) < 0) return true
	if (maxDate && Temporal.PlainDate.compare(d, maxDate) > 0) return true
	const result = disabledDates?.(d)
	if (result === true) return true
	if (typeof result === 'object' && result.disabled) return true
	return false
}

function getDisabledReason (d: Temporal.PlainDate): string | undefined {
	const result = disabledDates?.(d)
	if (typeof result === 'object') return result.reason
}

// The active range to display: preview (while selecting) or committed value
const activeRange = $computed((): DateRange => {
	if (selecting && anchor && hoverDay) {
		const cmp = Temporal.PlainDate.compare(anchor, hoverDay)
		return cmp <= 0
			? { start: anchor, end: hoverDay }
			: { start: hoverDay, end: anchor }
	}
	return modelValue ?? { start: null, end: null }
})

function isDaySelected (d: Temporal.PlainDate): boolean {
	const { start, end } = activeRange
	if (start && sameDay(d, start)) return true
	if (end && sameDay(d, end)) return true
	return false
}

function isDayInRange (d: Temporal.PlainDate): boolean {
	const { start, end } = activeRange
	if (!start || !end) return false
	return Temporal.PlainDate.compare(d, start) > 0 && Temporal.PlainDate.compare(d, end) < 0
}

function isDayRangeStart (d: Temporal.PlainDate): boolean {
	const { start } = activeRange
	return start != null && sameDay(d, start)
}

function isDayRangeEnd (d: Temporal.PlainDate): boolean {
	const { end } = activeRange
	return end != null && sameDay(d, end)
}

// ── Display value ───────────────────────────────────────────────────────────

const displayValue = $computed(() => {
	if (formatRange) return formatRange(modelValue ?? { start: null, end: null })
	const { start, end } = modelValue ?? {}
	if (!start) return end ? `Until ${formatDMY(end)}` : ''
	if (!end || sameDay(start, end)) return formatDMY(start)
	if (sameMonth(start, end)) return `${formatD(start)} - ${formatDMY(end)}`
	if (sameYear(start, end)) return `${formatDM(start)} - ${formatDMY(end)}`
	return `${formatDMY(start)} - ${formatDMY(end)}`
})

// ── Popover ─────────────────────────────────────────────────────────────────

watch($$(open), (isOpen) => {
	if (!popoverEl) return
	if (isOpen) {
		popoverEl.showPopover()
		document.addEventListener('mousedown', handleOutsideMousedown, true)
		document.addEventListener('focusin', handleOutsideFocus, true)
	} else {
		popoverEl.hidePopover()
		document.removeEventListener('mousedown', handleOutsideMousedown, true)
		document.removeEventListener('focusin', handleOutsideFocus, true)
	}
}, { flush: 'post' })

function handleOutsideMousedown (event: MouseEvent) {
	const target = event.target as Node | null
	if (!target) return
	if (el?.contains(target) || popoverEl?.contains(target)) return
	closePopover()
}

function handleOutsideFocus (event: FocusEvent) {
	const target = event.target as Node | null
	if (!target || el?.contains(target)) return
	closePopover()
}

onBeforeUnmount(() => {
	document.removeEventListener('mousedown', handleOutsideMousedown, true)
	document.removeEventListener('focusin', handleOutsideFocus, true)
})

async function openPopover (keyboard = false) {
	if (disabled || inline) return
	if (!open) {
		let startDay = modelValue?.start ?? Temporal.Now.plainDateISO()
		if (minDate && Temporal.PlainDate.compare(startDay, minDate) < 0) startDay = minDate
		if (maxDate && Temporal.PlainDate.compare(startDay, maxDate) > 0) startDay = maxDate
		focusedDay = startDay
		currentMonth = startOfMonth(startDay)
		open = true
	}
	await nextTick()
	if (keyboard) calendar?.focusDay()
	else inputEl?.focus()
}

function closePopover (returnFocus = false) {
	cancelSelection()
	open = false
	if (returnFocus) inputEl?.focus()
}

function cancelSelection () {
	anchor = null
	hoverDay = null
}

function handlePopoverToggle (event: ToggleEvent) {
	if (event.newState === 'closed' && open) {
		cancelSelection()
		open = false
	}
}

function handleInputKeydown (event: KeyboardEvent) {
	// Enter submits an enclosing form from an enabled textbox, but never from a disabled one.
	if (event.key === 'Enter' && disabled) {
		event.preventDefault()
		return
	}
	if (event.key === 'Escape' && open) {
		event.preventDefault()
		closePopover()
	} else if (event.key === 'ArrowDown' && event.altKey) {
		event.preventDefault()
		openPopover(true)
	}
}

// Escape from anywhere inside the popover (day, nav or preset buttons) cancels and hands focus back to the input.
function handlePopoverKeydown (event: KeyboardEvent) {
	if (event.key !== 'Escape' || inline) return
	event.preventDefault()
	closePopover(true)
}

// ── Day click state machine ─────────────────────────────────────────────────

function handleDayClick (day: Temporal.PlainDate) {
	if (locked || isDayDisabled(day)) return
	focusedDay = day

	if (!anchor) {
		anchor = day
		hoverDay = day
	} else {
		const cmp = Temporal.PlainDate.compare(anchor, day)
		const sorted: DateRange = cmp <= 0
			? { start: anchor, end: day }
			: { start: day, end: anchor }
		emit('update:modelValue', sorted)
		cancelSelection()
		if (!inline) closePopover(true)
	}
}

function handleDayHover (day: Temporal.PlainDate) {
	if (selecting) hoverDay = day
}

function isPresetDisabled (value: DateRange) {
	return locked || Boolean((value.start && isDayDisabled(value.start)) || (value.end && isDayDisabled(value.end)))
}

function applyPreset (preset: DatePreset<DateRange>) {
	if (locked) return
	const value = preset.getValue()
	if (isPresetDisabled(value)) return
	if (value.start) {
		currentMonth = startOfMonth(value.start)
		focusedDay = value.start
	}
	cancelSelection()
	emit('update:modelValue', value)
	if (!inline) closePopover(true)
}

function handleClear () {
	if (locked) return
	// Leave the action before the model update stops rendering it, so focus never sits on a removed control.
	if (inline && clearEl?.contains(document.activeElement)) focusCalendar()
	cancelSelection()
	emit('update:modelValue', { start: null, end: null })
	if (!inline) closePopover(true)
}

// ── Outline (input mode only) ─────────────────────────────────────────────

let radius = $ref(4)
const { Outline, updateOutline } = useInputOutline({ label: useTemplateRef('labelEl'), radius: $$(radius) })

const { classes: computedClasses } = useComputedStyle($$(el), {
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

const floatingLabel = $computed(() => Boolean(placeholder || modelValue?.start || modelValue?.end))

defineExpose({ el: $$(el), focus })

const inputClasses = $computed(() => [
	...computedClasses,
	{
		'bunt-input': !inline,
		focused: focused || open,
		'floating-label': focused || floatingLabel,
		disabled,
		selecting
	}
])
</script>
<template lang="pug">
.bunt-date-range-picker(ref="el", v-bind="rootAttrs()", :class="inputClasses")
	.label-input-container(v-if="!inline", v-resize-observer="updateOutline", @click="openPopover()")
		label(:for="id()")
			span(:id="`${id()}-label`", ref="labelEl") {{ label }}
			input(
				ref="inputEl",
				v-bind="controlAttrs()",
				:value="displayValue",
				:placeholder="placeholder",
				:aria-disabled="disabled || undefined",
				:aria-readonly="locked || undefined",
				:aria-expanded="open",
				:aria-controls="popoverId",
				role="combobox",
				aria-haspopup="dialog",
				aria-autocomplete="none",
				readonly,
				autocomplete="off",
				@keydown="handleInputKeydown"
			)
		button.clear-trigger(v-if="clearVisible", ref="clearEl", type="button", aria-label="Clear", @click.stop="handleClear")
			.mdi.mdi-close(aria-hidden="true")
		button.open-calendar-btn.mdi.mdi-calendar-month(type="button", tabindex="-1", aria-label="Open calendar", :disabled="disabled")
		Outline
	.calendar-caption(v-if="inline && label", :id="`${id()}-label`") {{ label }}
	div(
		:id="popoverId",
		ref="popoverEl",
		:popover="inline ? undefined : 'manual'",
		:role="inline ? undefined : 'dialog'",
		:aria-label="inline ? undefined : 'Choose date range'",
		:class="{ 'bunt-date-range-picker__inline': inline }",
		@toggle="handlePopoverToggle",
		@keydown="handlePopoverKeydown"
	)
		CalendarPanel(
			ref="calendar",
			v-bind="inline ? controlAttrs() : {}",
			v-model:month="currentMonth",
			v-model:focusedDay="focusedDay",
			:role="inline ? 'group' : undefined",
			:tabindex="inline ? groupTabindex : undefined",
			:aria-disabled="inline && disabled || undefined",
			:monthsToShow="monthsToShow",
			:weekStartsOn="weekStartsOn",
			:showWeekNumbers="showWeekNumbers",
			:locale="locale",
			:minDate="minDate",
			:maxDate="maxDate",
			:disabled="disabled",
			:readonly="readonly",
			:tabbableDays="tabbableDays",
			:navigateOnOutsideDayClick="navigateOnOutsideDayClick",
			:isDayDisabled="isDayDisabled",
			:getDisabledReason="getDisabledReason",
			:isDayInRange="isDayInRange",
			:isDayRangeStart="isDayRangeStart",
			:isDayRangeEnd="isDayRangeEnd",
			:isSelected="isDaySelected",
			multiple,
			@day-click="handleDayClick",
			@day-hover="handleDayHover"
		)
			.sr-only(role="status", aria-atomic="true") {{ selecting ? 'Start selected, choose end date.' : '' }}
			.presets(v-if="presets || (inline && clearVisible)", :class="{ 'inline-footer': inline }")
				button.preset-btn(v-for="p in presets", :key="p.label", type="button", :disabled="isPresetDisabled(p.getValue())", @click="applyPreset(p)") {{ p.label }}
				button.clear-btn(v-if="inline && clearVisible", ref="clearEl", type="button", @click="handleClear") Clear
	.hint(v-if="hasHint()", :id="`${id()}-hint`")
		slot(name="hint") {{ hint }}
</template>
