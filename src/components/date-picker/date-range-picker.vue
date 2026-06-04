<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useComputedStyle } from '../../computedStyle'
import { useInputOutline } from '../../utils/input-outline'
import CalendarMonth from './CalendarMonth.vue'
import {
	Temporal,
	type WeekStart,
	type DateRange,
	type DatePreset,
	startOfMonth,
	endOfMonth,
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
	label,
	name,
	minDate,
	maxDate,
	disabledDates,
	monthsToShow = 2,
	weekStartsOn: weekStartsOnProp,
	locale,
	showWeekNumbers = false,
	clearable = false,
	inline = false,
	navigateOnOutsideDayClick = true,
	presets,
	formatRange
} = defineProps<{
	modelValue?: DateRange
	placeholder?: string
	disabled?: boolean
	label?: string
	name?: string
	minDate?: Temporal.PlainDate
	maxDate?: Temporal.PlainDate
	disabledDates?: (d: Temporal.PlainDate) => boolean | { disabled: boolean; reason?: string }
	monthsToShow?: number
	weekStartsOn?: WeekStart
	locale?: string
	showWeekNumbers?: boolean
	clearable?: boolean
	inline?: boolean
	navigateOnOutsideDayClick?: boolean
	presets?: DatePreset<DateRange>[]
	formatRange?: (r: DateRange) => string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: DateRange]
}>()

const weekStartsOn = $computed(() => weekStartsOnProp ?? getLocaleWeekStart(locale))

let currentMonth = $ref<Temporal.PlainDate>(
	(modelValue?.start ? startOfMonth(modelValue.start) : null) ??
	Temporal.Now.plainDateISO().with({ day: 1 })
)
let focusedDay = $ref<Temporal.PlainDate | null>(null)
let open = $ref(false)

// Selection state machine
let anchor = $ref<Temporal.PlainDate | null>(null)
let hoverDay = $ref<Temporal.PlainDate | null>(null)
let selecting = $ref(false)

const el = $ref<HTMLElement>(null)
const inputEl = $ref<HTMLInputElement>(null)
const dialogEl = $ref<HTMLDialogElement>(null)

// ── Day classification ──────────────────────────────────────────────────────

function isDayDisabled (d: Temporal.PlainDate): boolean {
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
	if (!start && !end) return ''
	if (start && !end) return formatDMY(start)
	if (!start && end) return `Until ${formatDMY(end)}`
	if (sameDay(start!, end!)) return formatDMY(start!)
	if (sameMonth(start!, end!)) return `${formatD(start!)} - ${formatDMY(end!)}`
	if (sameYear(start!, end!)) return `${formatDM(start!)} - ${formatDMY(end!)}`
	return `${formatDMY(start!)} - ${formatDMY(end!)}`
})

// ── Navigation ──────────────────────────────────────────────────────────────

function currentMonthAt (offset: number): Temporal.PlainDate {
	return currentMonth.add({ months: offset })
}

function goToPrevMonth () {
	currentMonth = currentMonth.subtract({ months: 1 })
}

function goToNextMonth () {
	currentMonth = currentMonth.add({ months: 1 })
}

const isNextDisabled = $computed(() => {
	if (!maxDate) return false
	const lastVisible = currentMonthAt(monthsToShow - 1)
	return sameMonth(maxDate, lastVisible) || Temporal.PlainDate.compare(maxDate, endOfMonth(lastVisible)) <= 0
})

// ── Dialog ──────────────────────────────────────────────────────────────────

watch($$(open), (isOpen) => {
	if (isOpen) {
		dialogEl?.showModal()
	} else {
		dialogEl?.close()
	}
}, { flush: 'post' })

async function openDialog () {
	if (open || disabled) return
	const startDay = modelValue?.start ?? Temporal.Now.plainDateISO()
	focusedDay = startDay
	currentMonth = startOfMonth(startDay)
	open = true
	await nextTick()
	await nextTick()
	const cell = dialogEl?.querySelector<HTMLElement>('[tabindex="0"]')
	cell?.focus()
}

function closeDialog () {
	open = false
	nextTick(() => inputEl?.focus())
}

function handleDialogCancel (event: Event) {
	event.preventDefault()
	// Cancel any in-progress selection
	anchor = null
	hoverDay = null
	selecting = false
	open = false
	nextTick(() => inputEl?.focus())
}

// ── Day click state machine ─────────────────────────────────────────────────

function handleDayClick (day: Temporal.PlainDate) {
	if (isDayDisabled(day)) return

	if (!selecting) {
		anchor = day
		hoverDay = day
		selecting = true
	} else {
		const cmp = Temporal.PlainDate.compare(anchor!, day)
		const sorted: DateRange = cmp <= 0
			? { start: anchor, end: day }
			: { start: day, end: anchor }
		emit('update:modelValue', sorted)
		anchor = null
		hoverDay = null
		selecting = false
		if (!inline) closeDialog()
	}

	if (!inline && navigateOnOutsideDayClick && !sameMonth(day, currentMonth)) {
		currentMonth = startOfMonth(day)
	}
}

function handleDayHover (day: Temporal.PlainDate) {
	if (selecting) hoverDay = day
}

function handleKeyNavigate (day: Temporal.PlainDate) {
	focusedDay = day
	if (Temporal.PlainDate.compare(day, currentMonth) < 0) {
		currentMonth = currentMonth.subtract({ months: 1 })
	} else if (Temporal.PlainDate.compare(day, endOfMonth(currentMonthAt(monthsToShow - 1))) > 0) {
		currentMonth = currentMonth.add({ months: 1 })
	}
}

function applyPreset (preset: DatePreset<DateRange>) {
	const value = preset.getValue()
	// Cancel any in-progress selection
	anchor = null
	hoverDay = null
	selecting = false
	emit('update:modelValue', value)
	if (!inline) closeDialog()
}

function handleClear () {
	anchor = null
	hoverDay = null
	selecting = false
	emit('update:modelValue', { start: null, end: null })
	if (!inline) closeDialog()
}

// ── Outline (input mode only) ─────────────────────────────────────────────

let radius = $ref(4)
const { Outline, updateOutline } = useInputOutline($$(label), $$(radius))

watch($$(radius), (newVal, oldVal) => {
	if (newVal === oldVal) return
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

const floatingLabel = $computed(() => Boolean(placeholder || modelValue?.start || modelValue?.end))

const inputClasses = $computed(() => [
	'bunt-input',
	...computedClasses,
	{
		focused: open,
		'floating-label': floatingLabel,
		disabled,
		selecting
	}
])
</script>
<template lang="pug">
.bunt-date-range-picker(ref="el", :style="computedStyle")
	//- Inline mode
	template(v-if="inline")
		.bunt-date-range-picker__inline
			.calendar-nav
				button.nav-btn.mdi.mdi-chevron-left(
					@click="goToPrevMonth",
					aria-label="Previous month"
				)
				.spacer
				button.nav-btn.mdi.mdi-chevron-right(
					@click="goToNextMonth",
					:aria-disabled="isNextDisabled || undefined",
					:disabled="isNextDisabled",
					aria-label="Next month"
				)
			.calendar-area
				CalendarMonth(
					v-for="i in monthsToShow",
					:key="i",
					:month="currentMonthAt(i - 1)",
					:weekStartsOn="weekStartsOn",
					:showWeekNumbers="showWeekNumbers",
					:locale="locale",
					:focusedDay="focusedDay",
					:isDayDisabled="isDayDisabled",
					:getDisabledReason="getDisabledReason",
					:isDayInRange="isDayInRange",
					:isDayRangeStart="isDayRangeStart",
					:isDayRangeEnd="isDayRangeEnd",
					:isSelected="isDaySelected",
					@day-click="handleDayClick",
					@day-hover="handleDayHover",
					@key-navigate="handleKeyNavigate"
				)
			.inline-footer
				template(v-if="presets")
					button.preset-btn(v-for="p in presets", :key="p.label", @click="applyPreset(p)") {{ p.label }}
				button.clear-btn(
					v-if="clearable && (modelValue?.start || modelValue?.end)",
					@click="handleClear"
				) Clear

	//- Input mode
	template(v-else)
		.label-input-container(:class="inputClasses", v-resize-observer="updateOutline", @click="openDialog")
			label
				span {{ label }}
				input(
					ref="inputEl",
					:name="name",
					:value="displayValue",
					:placeholder="placeholder",
					:disabled="disabled",
					readonly,
					autocomplete="off",
					@focus="openDialog"
				)
			button.clear-trigger(
				v-if="clearable && (modelValue?.start || modelValue?.end) && !open",
				@click.stop="handleClear",
				aria-label="Clear"
			)
				.mdi.mdi-close
			Outline

		dialog(
			ref="dialogEl",
			aria-label="Choose date range",
			@cancel="handleDialogCancel"
		)
			.dialog-inner
				.calendar-nav
					button.nav-btn.mdi.mdi-chevron-left(
						@click="goToPrevMonth",
						aria-label="Previous month"
					)
					.spacer
					button.nav-btn.mdi.mdi-chevron-right(
						@click="goToNextMonth",
						:aria-disabled="isNextDisabled || undefined",
						:disabled="isNextDisabled",
						aria-label="Next month"
					)
				.calendar-area
					CalendarMonth(
						v-for="i in monthsToShow",
						:key="i",
						:month="currentMonthAt(i - 1)",
						:weekStartsOn="weekStartsOn",
						:showWeekNumbers="showWeekNumbers",
						:locale="locale",
						:focusedDay="focusedDay",
						:isDayDisabled="isDayDisabled",
						:getDisabledReason="getDisabledReason",
						:isDayInRange="isDayInRange",
						:isDayRangeStart="isDayRangeStart",
						:isDayRangeEnd="isDayRangeEnd",
						:isSelected="isDaySelected",
						@day-click="handleDayClick",
						@day-hover="handleDayHover",
						@key-navigate="handleKeyNavigate"
					)
				.presets(v-if="presets")
					button.preset-btn(v-for="p in presets", :key="p.label", @click="applyPreset(p)") {{ p.label }}
</template>
