<script setup lang="ts">
import { nextTick, watch } from 'vue'
import {
	Temporal,
	type WeekStart,
	generateCalendar,
	formatMY,
	isoWeekNumber,
	sameDay,
	sameMonth
} from './temporal'

const {
	month,
	weekStartsOn,
	showWeekNumbers,
	locale,
	focusedDay,
	isDayDisabled,
	isDayInRange,
	isDayRangeStart,
	isDayRangeEnd,
	isSelected,
	getDisabledReason
} = defineProps<{
	month: Temporal.PlainDate
	weekStartsOn: WeekStart
	showWeekNumbers: boolean
	locale?: string
	focusedDay?: Temporal.PlainDate | null
	isDayDisabled:(d: Temporal.PlainDate) => boolean
	isDayInRange?: (d: Temporal.PlainDate) => boolean
	isDayRangeStart?: (d: Temporal.PlainDate) => boolean
	isDayRangeEnd?: (d: Temporal.PlainDate) => boolean
	isSelected?: (d: Temporal.PlainDate) => boolean
	getDisabledReason?: (d: Temporal.PlainDate) => string | undefined
}>()

const emit = defineEmits<{
	'day-click': [day: Temporal.PlainDate]
	'day-hover': [day: Temporal.PlainDate]
	'key-navigate': [day: Temporal.PlainDate]
}>()

const el = $ref<HTMLElement>(null)

const MONDAY_HEADERS = [
	{ short: 'M', full: 'Monday' },
	{ short: 'T', full: 'Tuesday' },
	{ short: 'W', full: 'Wednesday' },
	{ short: 'T', full: 'Thursday' },
	{ short: 'F', full: 'Friday' },
	{ short: 'S', full: 'Saturday' },
	{ short: 'S', full: 'Sunday' }
]

const SUNDAY_HEADERS = [
	{ short: 'S', full: 'Sunday' },
	{ short: 'M', full: 'Monday' },
	{ short: 'T', full: 'Tuesday' },
	{ short: 'W', full: 'Wednesday' },
	{ short: 'T', full: 'Thursday' },
	{ short: 'F', full: 'Friday' },
	{ short: 'S', full: 'Saturday' }
]

const today = Temporal.Now.plainDateISO()

const gridLabelId = $computed(() => `calendar-label-${month.toString()}`)

const headers = $computed(() => weekStartsOn === 'monday' ? MONDAY_HEADERS : SUNDAY_HEADERS)

const days = $computed(() => generateCalendar(month, weekStartsOn))

const weeks = $computed(() => {
	const rows = []
	for (let i = 0; i < days.length; i += 7) {
		const weekDays = days.slice(i, i + 7)
		rows.push({
			number: isoWeekNumber(weekDays[weekStartsOn === 'monday' ? 0 : 1] ?? weekDays[0]),
			days: weekDays
		})
	}
	return rows
})

function dayAriaLabel (d: Temporal.PlainDate): string {
	return new Intl.DateTimeFormat(locale ?? navigator.language, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(d.year, d.month - 1, d.day))
}

function getDayClasses (d: Temporal.PlainDate): Record<string, boolean> {
	const disabled = isDayDisabled(d)
	return {
		'other-month': !sameMonth(d, month),
		today: sameDay(d, today),
		disabled,
		selected: !disabled && (isSelected ? isSelected(d) : false),
		'in-range': !disabled && (isDayInRange ? isDayInRange(d) : false),
		'range-start': !disabled && (isDayRangeStart ? isDayRangeStart(d) : false),
		'range-end': !disabled && (isDayRangeEnd ? isDayRangeEnd(d) : false)
	}
}

function isFocused (d: Temporal.PlainDate): boolean {
	return focusedDay != null && sameDay(d, focusedDay)
}

function handleDayClick (d: Temporal.PlainDate) {
	if (isDayDisabled(d)) return
	emit('day-click', d)
}

function handleKeydown (event: KeyboardEvent, currentDay: Temporal.PlainDate | null | undefined) {
	const base = currentDay ?? month.with({ day: 1 })

	let next: Temporal.PlainDate | null = null

	switch (event.key) {
		case 'ArrowRight':
			next = base.add({ days: 1 })
			break
		case 'ArrowLeft':
			next = base.subtract({ days: 1 })
			break
		case 'ArrowDown':
			next = base.add({ days: 7 })
			break
		case 'ArrowUp':
			next = base.subtract({ days: 7 })
			break
		case 'PageDown':
			next = event.shiftKey ? base.add({ years: 1 }) : base.add({ months: 1 })
			break
		case 'PageUp':
			next = event.shiftKey ? base.subtract({ years: 1 }) : base.subtract({ months: 1 })
			break
		case 'Home': {
			// first day of current week row
			const offset = weekStartsOn === 'monday' ? base.dayOfWeek - 1 : base.dayOfWeek % 7
			next = base.subtract({ days: offset })
			break
		}
		case 'End': {
			// last day of current week row
			const offset = weekStartsOn === 'monday' ? 7 - base.dayOfWeek : 6 - (base.dayOfWeek % 7)
			next = base.add({ days: offset })
			break
		}
		case 'Enter':
		case ' ':
			if (!isDayDisabled(base)) emit('day-click', base)
			event.preventDefault()
			return
		default:
			return
	}

	if (next) {
		event.preventDefault()
		emit('key-navigate', next)
	}
}

// Focus the cell that matches focusedDay when it changes
// Works both for initial focus (from dialog open) and subsequent arrow-key navigation
watch(
	() => focusedDay,
	async () => {
		if (!focusedDay || !el) return
		await nextTick()
		const focused = el.querySelector<HTMLElement>('[tabindex="0"]')
		if (!focused) return
		// Only steal focus if we already have it, or if nothing inside the dialog is focused yet
		const activeEl = document.activeElement
		if (el.contains(activeEl) || activeEl === document.body || activeEl?.closest('dialog')?.contains(el)) {
			focused.focus()
		}
	}
)
</script>
<template lang="pug">
.c-calendar-month(ref="el")
	.sr-only(:id="gridLabelId", aria-live="polite", aria-atomic="true") {{ formatMY(month, locale) }}
	.calendar-grid(role="grid", :aria-labelledby="gridLabelId", :class="{ 'has-week-numbers': showWeekNumbers }")
		.calendar-row(role="row")
			.col-header(v-if="showWeekNumbers", role="columnheader", aria-label="Week") Wk
			.col-header(
				v-for="header in headers",
				:key="header.full",
				role="columnheader",
				:aria-label="header.full",
				:abbr="header.full"
			) {{ header.short }}
		.calendar-row(v-for="week in weeks", :key="week.number", role="row")
			.week-num(
				v-if="showWeekNumbers",
				role="rowheader",
				:aria-label="`Week ${week.number}`"
			) {{ week.number }}
			.day-cell(
				v-for="day in week.days",
				:key="day.toString()",
				role="gridcell"
			)
				button(
					v-tooltip="isDayDisabled(day) && getDisabledReason ? getDisabledReason(day) : ''",
					:class="getDayClasses(day)",
					:tabindex="isFocused(day) ? 0 : -1",
					:disabled="isDayDisabled(day)",
					:aria-label="dayAriaLabel(day)",
					:aria-selected="(isSelected ? isSelected(day) : false) || (isDayInRange ? isDayInRange(day) : false) || undefined",
					:aria-disabled="isDayDisabled(day) || undefined",
					@click="handleDayClick(day)",
					@mouseover="emit('day-hover', day)",
					@keydown="handleKeydown($event, focusedDay)"
				) {{ day.day }}
</template>
