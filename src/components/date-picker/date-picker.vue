<script setup lang="ts">
import { nextTick, onBeforeUnmount, useId, watch } from 'vue'
import { useComputedStyle } from '../../computedStyle'
import { useInputOutline } from '../../utils/input-outline'
import {
	type Segment,
	type SegmentName,
	parseSegments,
	isCanonicalISO,
	getSegmentAt,
	adjacentSegment,
	incrementDate,
	segmentMax
} from '../../utils/segmented-date-input'
import CalendarPanel from './CalendarPanel.vue'
import {
	Temporal,
	type WeekStart,
	type DatePreset,
	startOfMonth,
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
	parseInput
} = defineProps<{
	modelValue?: Temporal.PlainDate | null
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
	presets?: DatePreset<Temporal.PlainDate>[]
	parseInput?: (text: string) => Temporal.PlainDate | null
}>()

const emit = defineEmits<{
	'update:modelValue': [value: Temporal.PlainDate | null]
}>()

const weekStartsOn = $computed(() => weekStartsOnProp ?? getLocaleWeekStart(locale))

let currentMonth = $ref<Temporal.PlainDate>(
	modelValue ? startOfMonth(modelValue) : Temporal.Now.plainDateISO().with({ day: 1 })
)
let focusedDay = $ref<Temporal.PlainDate | null>(modelValue ?? Temporal.Now.plainDateISO())
let draftText = $ref<string | null>(null)
let open = $ref(false)
let focused = $ref(false)

// Type-over-segment buffer state
let segmentBuffer = $ref('')
let segmentBufferFor = $ref<SegmentName | null>(null)

const el = $ref<HTMLElement>(null)

// ── Input ──────────────────────────────────────────────

const inputEl = $ref<HTMLInputElement>(null)

function handleInputInput (event: Event) {
	const value = (event.target as HTMLInputElement).value
	draftText = value
	const parsed = parseInputFn(value)
	if (parsed) {
		currentMonth = startOfMonth(parsed)
		focusedDay = parsed
	}
}

function handleInputPaste (event: ClipboardEvent) {
	const pasted = event.clipboardData?.getData('text') ?? ''
	if (!pasted) return
	const parsed = parseInputFn(pasted)
	if (parsed && !isDayDisabled(parsed)) {
		event.preventDefault()
		// Clear any in-progress state and commit the parsed value.
		segmentBuffer = ''
		segmentBufferFor = null
		draftText = null
		emit('update:modelValue', parsed)
		currentMonth = startOfMonth(parsed)
		focusedDay = parsed
	}
	// Parse failed — fall through to native paste; handleInputInput will capture the raw draft
	// and commitDraft (on Enter / blur) will re-attempt parsing.
}

function commitDraft () {
	if (draftText === null) return
	const parsed = parseInputFn(draftText)
	if (parsed && !isDayDisabled(parsed)) {
		emit('update:modelValue', parsed)
	} else if (!draftText.trim()) {
		emit('update:modelValue', null)
	}
	draftText = null
}

// ── Segmented editing ─────────────────────────────────────

function canSegment (): boolean {
	// Segmented nav only works against a canonical ISO string (no mid-typing drafts).
	return draftText === null && isCanonicalISO(displayValue)
}

function getCurrentSegment (): Segment | null {
	if (!inputEl) return null
	const segments = parseSegments(displayValue, locale)
	const caret = inputEl.selectionStart ?? 0
	return getSegmentAt(segments, caret)
}

function selectSegment (segment: Segment) {
	inputEl?.setSelectionRange(segment.start, segment.end)
}

function handleInputFocus () {
	focused = true
	if (!canSegment()) return
	// On Tab-focus, select the first segment. Clicks are handled separately (handleInputClick)
	// so the clicked segment wins when the two events fire together.
	nextTick(() => {
		if (!inputEl) return
		const segments = parseSegments(displayValue, locale)
		if (segments.length) selectSegment(segments[0])
	})
}

function handleInputClick () {
	if (!canSegment()) return
	nextTick(() => {
		const seg = getCurrentSegment()
		if (seg) selectSegment(seg)
	})
}

function handleInputBlur () {
	focused = false
	// Discard any in-progress segment buffer on blur; don't commit partial typing.
	if (segmentBufferFor !== null) {
		segmentBuffer = ''
		segmentBufferFor = null
		draftText = null
		return
	}
	commitDraft()
}

// ── Type-over-segment ──────────────────────────────────────

function previewSegmentBuffer (segment: Segment, buf: string) {
	const padded = buf.padStart(segment.length, '0')
	const current = displayValue
	draftText = current.substring(0, segment.start) + padded + current.substring(segment.end)
	nextTick(() => selectSegment(segment))
}

function commitSegmentBuffer (segment: Segment) {
	const basis = getBasisDate()
	const value = Number(segmentBuffer)
	let newDate: Temporal.PlainDate
	try {
		if (segment.name === 'day') newDate = basis.with({ day: value }, { overflow: 'reject' })
		else if (segment.name === 'month') newDate = basis.with({ month: value })
		else newDate = basis.with({ year: value })
	} catch {
		// Invalid (e.g. Feb 30) — clear preview, stay on segment.
		segmentBuffer = ''
		segmentBufferFor = null
		draftText = null
		nextTick(() => selectSegment(segment))
		return
	}

	if (isDayDisabled(newDate)) {
		segmentBuffer = ''
		segmentBufferFor = null
		draftText = null
		nextTick(() => selectSegment(segment))
		return
	}

	segmentBuffer = ''
	segmentBufferFor = null
	draftText = null
	emit('update:modelValue', newDate)
	currentMonth = startOfMonth(newDate)
	focusedDay = newDate

	const segments = parseSegments(displayValue, locale)
	const next = adjacentSegment(segments, segment, 1)
	nextTick(() => selectSegment(next ?? segment))
}

function handleSegmentDigit (digit: string) {
	const current = getCurrentSegment()
	if (!current) return

	// Reset buffer if it was for a different segment
	if (segmentBufferFor !== current.name) {
		segmentBuffer = ''
	}
	segmentBufferFor = current.name

	let buf = segmentBuffer + digit
	const max = segmentMax(current.name)

	// If buffer numeric value overflows max, treat this digit as a fresh start.
	if (Number(buf) > max) buf = digit

	segmentBuffer = buf

	// Commit when:
	//  - segment is full, or
	//  - an additional digit would necessarily overflow max (e.g. month "2" then "9" → max 29 > 12)
	const shouldCommit = buf.length === current.length || Number(buf + '0') > max
	if (shouldCommit) commitSegmentBuffer(current)
	else previewSegmentBuffer(current, buf)
}

function handleInputKeydown (event: KeyboardEvent) {
	if (event.key === 'Enter') {
		event.preventDefault()
		commitDraft()
		closePopover()
		return
	}
	if (event.key === 'Escape') {
		event.preventDefault()
		draftText = null
		segmentBuffer = ''
		segmentBufferFor = null
		closePopover()
		return
	}
	if (event.key === 'ArrowDown' && event.altKey) {
		event.preventDefault()
		openPopover(true)
		return
	}

	if (event.ctrlKey || event.metaKey || event.altKey) return
	const selection = inputEl ? displayValue.slice(inputEl.selectionStart ?? 0, inputEl.selectionEnd ?? 0) : ''
	if (selection === displayValue && displayValue) return

	// Segmented nav (only when value is canonical ISO)
	if (!canSegment() && segmentBufferFor === null) return
	const segments = parseSegments(displayValue, locale)
	const current = getCurrentSegment()
	if (!current) return

	if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
		const dir = event.key === 'ArrowLeft' ? -1 : 1
		const next = adjacentSegment(segments, current, dir)
		if (next) {
			event.preventDefault()
			// If a buffer was in progress, commit it before moving.
			if (segmentBufferFor !== null) {
				commitSegmentBuffer(current)
				nextTick(() => selectSegment(next))
			} else {
				selectSegment(next)
			}
		}
		return
	}
	if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
		event.preventDefault()
		const delta = event.key === 'ArrowUp' ? 1 : -1
		const newDate = incrementDate(getBasisDate(), current.name, delta)
		if (isDayDisabled(newDate)) return
		emit('update:modelValue', newDate)
		currentMonth = startOfMonth(newDate)
		focusedDay = newDate
		nextTick(() => selectSegment(current))
		return
	}

	// Type-over-segment: digit keys without modifiers replace segment value.
	if (/^\d$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
		event.preventDefault()
		handleSegmentDigit(event.key)
		return
	}

	// Separator keys commit in-progress buffer and advance.
	if (['-', '.', '/', ' '].includes(event.key) && segmentBufferFor !== null) {
		event.preventDefault()
		commitSegmentBuffer(current)
	}
}

// ── Popover ─────────────────────────────────────────────

const popoverEl = $ref<HTMLElement>(null)
const calendar = $ref<InstanceType<typeof CalendarPanel>>(null)
const popoverId = `bunt-date-picker-popover-${useId()}`

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

onBeforeUnmount(() => {
	document.removeEventListener('mousedown', handleOutsideMousedown, true)
	document.removeEventListener('focusin', handleOutsideFocus, true)
})

function handleOutsideMousedown (event: MouseEvent) {
	const target = event.target as Node | null
	if (!target) return
	if (el?.contains(target) || popoverEl?.contains(target)) return
	closePopover()
}

function handleOutsideFocus (event: FocusEvent) {
	const target = event.target as Node | null
	if (!target) return
	if (el?.contains(target) || popoverEl?.contains(target)) return
	closePopover()
}

async function openPopover (keyboard = false) {
	if (disabled || inline) return
	if (!open) {
		let initialDay = modelValue ?? Temporal.Now.plainDateISO()
		if (minDate && Temporal.PlainDate.compare(initialDay, minDate) < 0) initialDay = minDate
		if (maxDate && Temporal.PlainDate.compare(initialDay, maxDate) > 0) initialDay = maxDate
		focusedDay = initialDay
		currentMonth = startOfMonth(initialDay)
		open = true
	}
	await nextTick()
	if (keyboard) calendar?.focusDay()
	else inputEl?.focus()
}

function closePopover (returnFocus = false) {
	open = false
	if (returnFocus) inputEl?.focus()
}

function handlePopoverKeydown (event: KeyboardEvent) {
	if (event.key !== 'Escape' || inline) return
	event.preventDefault()
	draftText = null
	closePopover(true)
}

function handlePopoverToggle (event: ToggleEvent) {
	// Sync Vue state if the browser changes popover state (e.g. programmatic hidePopover, or future popovertarget wiring)
	if (event.newState === 'closed' && open) open = false
}

function parseInputFn (text: string) {
	return (parseInput ?? parseDate)(text)
}

const displayValue = $computed(() => {
	if (draftText !== null) return draftText
	if (modelValue) return modelValue.toString() // canonical YYYY-MM-DD
	return ''
})

function getBasisDate (): Temporal.PlainDate {
	return modelValue ?? Temporal.Now.plainDateISO()
}

const draftInvalid = $computed(() => draftText !== null && !parseInputFn(draftText))

// ── Calendar ─────────────────────────────────────────────

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

function handleDayClick (day: Temporal.PlainDate) {
	if (isDayDisabled(day)) return
	focusedDay = day
	draftText = null
	emit('update:modelValue', day)
	if (!inline) closePopover(true)
}

function applyPreset (preset: DatePreset<Temporal.PlainDate>) {
	const value = preset.getValue()
	if (isDayDisabled(value)) return
	draftText = null
	currentMonth = startOfMonth(value)
	focusedDay = value
	emit('update:modelValue', value)
	if (!inline) closePopover(true)
}

function handleClear () {
	if (disabled) return
	draftText = null
	segmentBuffer = ''
	segmentBufferFor = null
	emit('update:modelValue', null)
	if (!inline) closePopover(true)
}

// ── Presentation ─────────────────────────────────────────────

let radius = $ref(4)
const { Outline, updateOutline } = useInputOutline($$(label), $$(radius))

watch($$(radius), (newVal, oldVal) => {
	if (newVal === oldVal) return
	updateOutline()
})

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

const floatingLabel = $computed(() => Boolean(placeholder || modelValue))

const inputClasses = $computed(() => [
	...computedClasses,
	{
		'bunt-input': !inline,
		focused: focused || open,
		'floating-label': focused || floatingLabel,
		disabled
	}
])
</script>
<template lang="pug">
.bunt-date-picker(ref="el", :class="inputClasses")
	.label-input-container(v-if="!inline", v-resize-observer="updateOutline", @click="openPopover()")
		label
			span {{ label }}
			input(
				ref="inputEl",
				:name="name",
				:value="displayValue",
				:placeholder="placeholder",
				:disabled="disabled",
				:aria-invalid="draftInvalid || undefined",
				:aria-expanded="open",
				:aria-controls="popoverId",
				:aria-describedby="`${popoverId}-help`",
				role="combobox",
				aria-haspopup="dialog",
				aria-autocomplete="none",
				autocomplete="off",
				@focus="handleInputFocus",
				@click="handleInputClick",
				@input="handleInputInput",
				@paste="handleInputPaste",
				@blur="handleInputBlur",
				@keydown="handleInputKeydown"
			)
		button.open-calendar-btn.mdi.mdi-calendar-month(type="button", tabindex="-1", aria-label="Open calendar", :disabled="disabled")
		button.clear-trigger(v-if="clearable && modelValue", type="button", aria-label="Clear", :disabled="disabled", @click.stop="handleClear")
			.mdi.mdi-close(aria-hidden="true")
		Outline
	.sr-only(v-if="!inline", :id="`${popoverId}-help`") Date format: YYYY-MM-DD. Alt+Down opens the calendar.
	div(
		:id="popoverId",
		ref="popoverEl",
		:popover="inline ? undefined : 'manual'",
		:role="inline ? undefined : 'dialog'",
		:aria-label="inline ? undefined : 'Choose date'",
		:class="{ 'bunt-date-picker__inline': inline }",
		@toggle="handlePopoverToggle",
		@keydown="handlePopoverKeydown"
	)
		CalendarPanel(
			ref="calendar",
			v-model:month="currentMonth",
			v-model:focusedDay="focusedDay",
			:monthsToShow="monthsToShow",
			:weekStartsOn="weekStartsOn",
			:showWeekNumbers="showWeekNumbers",
			:locale="locale",
			:minDate="minDate",
			:maxDate="maxDate",
			:disabled="disabled",
			:navigateOnOutsideDayClick="navigateOnOutsideDayClick",
			:isDayDisabled="isDayDisabled",
			:getDisabledReason="getDisabledReason",
			:isSelected="modelValue ? (d) => d.equals(modelValue) : undefined",
			@day-click="handleDayClick"
		)
			.presets(v-if="presets || (inline && clearable && modelValue)", :class="{ 'inline-footer': inline }")
				button.preset-btn(v-for="p in presets", :key="p.label", type="button", :disabled="isDayDisabled(p.getValue())", @click="applyPreset(p)") {{ p.label }}
				button.clear-btn(v-if="inline && clearable && modelValue", type="button", :disabled="disabled", @click="handleClear") Clear
</template>
