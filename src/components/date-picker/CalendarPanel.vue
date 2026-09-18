<script setup lang="ts">
import { nextTick } from 'vue'
import CalendarMonth from './CalendarMonth.vue'
import { Temporal, startOfMonth, endOfMonth, formatMY, type WeekStart } from './temporal'

const {
	month,
	focusedDay,
	monthsToShow,
	weekStartsOn,
	showWeekNumbers,
	locale,
	minDate,
	maxDate,
	disabled,
	multiple,
	navigateOnOutsideDayClick = true,
	isDayDisabled,
	getDisabledReason,
	isSelected,
	isDayInRange,
	isDayRangeStart,
	isDayRangeEnd
} = defineProps<{
	month: Temporal.PlainDate
	focusedDay: Temporal.PlainDate | null
	monthsToShow: number
	weekStartsOn: WeekStart
	showWeekNumbers: boolean
	locale?: string
	minDate?: Temporal.PlainDate
	maxDate?: Temporal.PlainDate
	disabled?: boolean
	multiple?: boolean
	navigateOnOutsideDayClick?: boolean
	isDayDisabled: (day: Temporal.PlainDate) => boolean
	getDisabledReason?: (day: Temporal.PlainDate) => string | undefined
	isSelected?: (day: Temporal.PlainDate) => boolean
	isDayInRange?: (day: Temporal.PlainDate) => boolean
	isDayRangeStart?: (day: Temporal.PlainDate) => boolean
	isDayRangeEnd?: (day: Temporal.PlainDate) => boolean
}>()

const emit = defineEmits<{
	'update:month': [month: Temporal.PlainDate]
	'update:focusedDay': [day: Temporal.PlainDate]
	'day-click': [day: Temporal.PlainDate]
	'day-hover': [day: Temporal.PlainDate]
}>()

const el = $ref<HTMLElement>(null)
const monthCount = $computed(() => Math.max(1, Math.trunc(Number(monthsToShow)) || 1))
const lastMonth = $computed(() => month.add({ months: monthCount - 1 }))
const previousDisabled = $computed(() => disabled || (minDate && Temporal.PlainDate.compare(minDate, month) >= 0))
const nextDisabled = $computed(() => disabled || (maxDate && Temporal.PlainDate.compare(maxDate, endOfMonth(lastMonth)) <= 0))
const monthAnnouncement = $computed(() => monthCount === 1 ? formatMY(month, locale) : `${formatMY(month, locale)} – ${formatMY(lastMonth, locale)}`)

function changeMonth (offset: number) {
	const next = month.add({ months: offset })
	emit('update:month', next)
	emit('update:focusedDay', next.with({ day: focusedDay?.day ?? 1 }))
}

function focusDay () {
	const target = focusedDay ?? month
	el?.querySelector<HTMLElement>(`button[data-date="${target}"][data-month="${startOfMonth(target)}"]`)?.focus()
}

async function selectDay (day: Temporal.PlainDate) {
	const changesMonth = navigateOnOutsideDayClick && (Temporal.PlainDate.compare(day, month) < 0 || Temporal.PlainDate.compare(day, endOfMonth(lastMonth)) > 0)
	if (changesMonth) {
		emit('update:month', startOfMonth(day))
	}
	emit('day-click', day)
	if (changesMonth) {
		await nextTick()
		if (el?.getClientRects().length) focusDay()
	}
}

async function navigate (day: Temporal.PlainDate) {
	if (Temporal.PlainDate.compare(day, month) < 0) {
		emit('update:month', startOfMonth(day))
	} else if (Temporal.PlainDate.compare(day, endOfMonth(lastMonth)) > 0) {
		emit('update:month', startOfMonth(day).subtract({ months: monthCount - 1 }))
	}
	emit('update:focusedDay', day)
	emit('day-hover', day)
	await nextTick()
	focusDay()
}

defineExpose({ focusDay })
</script>
<template lang="pug">
.c-calendar-panel(ref="el")
	.calendar-nav
		button.nav-btn.mdi.mdi-chevron-left(type="button", aria-label="Previous month", :disabled="previousDisabled", @click="changeMonth(-1)")
		.sr-only(aria-live="polite", aria-atomic="true") {{ monthAnnouncement }}
		.spacer
		button.nav-btn.mdi.mdi-chevron-right(type="button", aria-label="Next month", :disabled="nextDisabled", @click="changeMonth(1)")
	.calendar-area
		CalendarMonth(
			v-for="i in monthCount",
			:key="i",
			:month="month.add({ months: i - 1 })",
			:focusedDay="focusedDay",
			:weekStartsOn="weekStartsOn",
			:showWeekNumbers="showWeekNumbers",
			:locale="locale",
			:disabled="disabled",
			:multiple="multiple",
			:isDayDisabled="isDayDisabled",
			:getDisabledReason="getDisabledReason",
			:isSelected="isSelected",
			:isDayInRange="isDayInRange",
			:isDayRangeStart="isDayRangeStart",
			:isDayRangeEnd="isDayRangeEnd",
			@day-click="selectDay",
			@day-hover="emit('day-hover', $event)",
			@day-focus="emit('update:focusedDay', $event)",
			@key-navigate="navigate"
		)
	slot
</template>
