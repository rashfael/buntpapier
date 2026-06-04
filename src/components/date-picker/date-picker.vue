<script setup lang="ts">
// TODOs
// - decouple input focus from open to be more native
import { nextTick, watch } from 'vue'
import { useComputedStyle } from '../../computedStyle'
import { useInputOutline } from '../../utils/input-outline'
import CalendarMonth from './CalendarMonth.vue'
import {
	Temporal,
	type WeekStart,
	type DatePreset,
	startOfMonth,
	endOfMonth,
	sameMonth,
	formatMY,
	formatDMY,
	getLocaleWeekStart,
	parseDate
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
	monthsToShow = 1,
	weekStartsOn: weekStartsOnProp,
	locale,
	showWeekNumbers = false,
	clearable = false,
	inline = false,
	navigateOnOutsideDayClick = true,
	presets,
	formatValue,
	parseInput
} = defineProps<{
	modelValue?: Temporal.PlainDate | null
	placeholder?: string
	disabled?: boolean
	label?: string
	name?: string
	minDate?: Temporal.PlainDate
	maxDate?: Temporal.PlainDate
	disabledDates?:(d: Temporal.PlainDate) => boolean | { disabled: boolean; reason?: string }
	monthsToShow?: number
	weekStartsOn?: WeekStart
	locale?: string
	showWeekNumbers?: boolean
	clearable?: boolean
	inline?: boolean
	navigateOnOutsideDayClick?: boolean
	presets?: DatePreset<Temporal.PlainDate>[]
	formatValue?: (d: Temporal.PlainDate) => string
	parseInput?: (text: string) => Temporal.PlainDate | null
}>()

const emit = defineEmits<{
	'update:modelValue': [value: Temporal.PlainDate | null]
}>()

const weekStartsOn = $computed(() => weekStartsOnProp ?? getLocaleWeekStart(locale))

let currentMonth = $ref<Temporal.PlainDate>(
	modelValue ? startOfMonth(modelValue) : Temporal.Now.plainDateISO().with({ day: 1 })
)
let focusedDay = $ref<Temporal.PlainDate | null>(null)
let draftText = $ref<string | null>(null)
let open = $ref(false)

const el = $ref<HTMLElement>(null)

// ── Input ──────────────────────────────────────────────

const inputEl = $ref<HTMLInputElement>(null)

function handleInputFocus (event) {
	// don't open dialog if re-focus origininated from dialog or from anywhere inside it (e.g. calendar buttons)
	if (event.relatedTarget === dialogEl || dialogEl?.contains(event.relatedTarget as Node)) return
	openDialog()
}

function handleInputInput (event: Event) {
	const value = (event.target as HTMLInputElement).value
	draftText = value
	const parsed = parseInputFn(value)
	if (parsed) {
		currentMonth = startOfMonth(parsed)
		focusedDay = parsed
	}
}

function commitDraft () {
	if (draftText === null) return
	const parsed = parseInputFn(draftText)
	if (parsed && !isDayDisabled(parsed)) {
		emit('update:modelValue', parsed)
		closeDialog()
	}
	draftText = null
}

function handleInputBlur () {
	commitDraft()
}

function handleInputKeydown (event: KeyboardEvent) {
	if (event.key === 'Enter') {
		event.preventDefault()
		commitDraft()
	}
	// Escape is handled by the dialog's cancel event
}

// ── Dialog ─────────────────────────────────────────────

const dialogEl = $ref<HTMLDialogElement>(null)

watch($$(open), (isOpen) => {
	if (isOpen) {
		dialogEl?.showModal()
	} else {
		dialogEl?.close()
	}
})

async function openDialog () {
	if (open || disabled) return
	const initialDay = modelValue || Temporal.Now.plainDateISO()
	focusedDay = initialDay
	currentMonth = startOfMonth(initialDay)
	open = true
	// After the dialog opens and CalendarMonth renders, focus the active day cell
	await nextTick()
	await nextTick() // second tick: CalendarMonth has rendered with the new focusedDay
	const cell = dialogEl?.querySelector<HTMLElement>('[tabindex="0"]')
	cell?.focus()
}

function closeDialog () {
	open = false
	nextTick(() => inputEl?.focus())
}

function handleDialogCancel (event: Event) {
	event.preventDefault()
	draftText = null
	open = false
	nextTick(() => inputEl?.focus())
}

const parseInputFn = parseInput ?? parseDate

const displayValue = $computed(() => {
	if (draftText !== null) return draftText
	if (!modelValue) return ''
	return formatValue ? formatValue(modelValue) : formatDMY(modelValue)
})

const draftInvalid = $computed(() => draftText !== null && !parseInputFn(draftText))

// ── Calendar ─────────────────────────────────────────────

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

function handleDayClick (day: Temporal.PlainDate) {
	if (isDayDisabled(day)) return
	if (!inline && navigateOnOutsideDayClick && !sameMonth(day, currentMonth)) {
		currentMonth = startOfMonth(day)
	}
	draftText = null
	emit('update:modelValue', day)
	if (!inline) closeDialog()
}

function handleKeyNavigate (day: Temporal.PlainDate) {
	focusedDay = day
	// advance view if needed
	if (Temporal.PlainDate.compare(day, currentMonth) < 0) {
		currentMonth = currentMonth.subtract({ months: 1 })
	} else if (Temporal.PlainDate.compare(day, endOfMonth(currentMonthAt(monthsToShow - 1))) > 0) {
		currentMonth = currentMonth.add({ months: 1 })
	}
}

function applyPreset (preset: DatePreset<Temporal.PlainDate>) {
	const value = preset.getValue()
	emit('update:modelValue', value)
	if (!inline) closeDialog()
}

function handleClear () {
	emit('update:modelValue', null)
	if (!inline) closeDialog()
}

// ── Presentation ─────────────────────────────────────────────

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

const floatingLabel = $computed(() => Boolean(placeholder || modelValue))

const inputClasses = $computed(() => [
	...computedClasses,
	{
		focused: open,
		'floating-label': floatingLabel,
		disabled
	}
])
</script>
<template lang="pug">
//- Input mode: trigger + dialog
.bunt-date-picker.bunt-input(ref="el", v-resize-observer="updateOutline", :style="computedStyle",:class="inputClasses", @click="openDialog")
	.label-input-container
		label
			span {{ label }}
			input(
				ref="inputEl",
				:name="name",
				:value="displayValue",
				:placeholder="placeholder",
				:disabled="disabled",
				autocomplete="off",
				@focus="handleInputFocus",
				@input="handleInputInput",
				@blur="handleInputBlur",
				@keydown="handleInputKeydown"
			)
		Outline

	dialog(
		ref="dialogEl",
		aria-label="Choose date",
		@click.stop.self="closeDialog",
		@cancel="handleDialogCancel"
	)
		.dialog-inner
			.calendar-nav
				bunt-button(icon="chevron-left", aria-label="Previous month", @click="goToPrevMonth")
				.month-label(id="dp-month-label", aria-live="polite", aria-atomic="true") {{ formatMY(currentMonth, locale) }}
				bunt-button(icon="chevron-right", aria-label="Next month", :disabled="isNextDisabled", @click="goToNextMonth")
			.calendar-area
				CalendarMonth(
					v-for="i in monthsToShow",
					:key="i",
					:month="currentMonthAt(i - 1)",
					:week-starts-on="weekStartsOn",
					:show-week-numbers="showWeekNumbers",
					:locale="locale",
					:focused-day="focusedDay",
					:is-day-disabled="isDayDisabled",
					:get-disabled-reason="getDisabledReason",
					:is-selected="modelValue ? (d) => d.equals(modelValue) : undefined",
					@day-click="handleDayClick",
					@day-hover="focusedDay = $event",
					@key-navigate="handleKeyNavigate"
				)
			.presets(v-if="presets")
				button.preset-btn(v-for="p in presets", :key="p.label", @click="applyPreset(p)") {{ p.label }}
</template>
