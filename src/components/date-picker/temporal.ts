import { Temporal } from '@js-temporal/polyfill'

export { Temporal }

export interface DateRange {
	start: Temporal.PlainDate | null
	end: Temporal.PlainDate | null
}

export type WeekStart = 'monday' | 'sunday'

// ─── Calendar helpers ────────────────────────────────────────────────────────

export function startOfWeek (d: Temporal.PlainDate, weekStartsOn: WeekStart = 'monday'): Temporal.PlainDate {
	// ISO dayOfWeek: Mon=1 … Sun=7
	if (weekStartsOn === 'monday') {
		return d.subtract({ days: d.dayOfWeek - 1 })
	} else {
		return d.subtract({ days: d.dayOfWeek % 7 })
	}
}

export function endOfWeek (d: Temporal.PlainDate, weekStartsOn: WeekStart = 'monday'): Temporal.PlainDate {
	if (weekStartsOn === 'monday') {
		return d.add({ days: 7 - d.dayOfWeek })
	} else {
		return d.add({ days: 6 - (d.dayOfWeek % 7) })
	}
}

export function startOfMonth (d: Temporal.PlainDate): Temporal.PlainDate {
	return d.with({ day: 1 })
}

export function endOfMonth (d: Temporal.PlainDate): Temporal.PlainDate {
	return d.with({ day: d.daysInMonth })
}

export function getLocaleWeekStart (locale?: string): WeekStart {
	try {
		const firstDay = new Intl.Locale(locale ?? navigator.language).weekInfo?.firstDay
		// Some locales return 7 for Sunday
		if (firstDay === 7 || firstDay === 0) return 'sunday'
		if (firstDay === 1) return 'monday'
	} catch {
		// ignore
	}
	return 'monday'
}

export function generateCalendar (month: Temporal.PlainDate, weekStartsOn: WeekStart): Temporal.PlainDate[] {
	const first = startOfMonth(month)
	const last = endOfMonth(month)
	const gridStart = startOfWeek(first, weekStartsOn)
	const gridEnd = endOfWeek(last, weekStartsOn)

	const days: Temporal.PlainDate[] = []
	let cur = gridStart
	while (Temporal.PlainDate.compare(cur, gridEnd) <= 0) {
		days.push(cur)
		cur = cur.add({ days: 1 })
	}
	return days
}

// ─── Formatting ──────────────────────────────────────────────────────────────

export function formatD (d: Temporal.PlainDate): string {
	return String(d.day).padStart(2, '0') + '.'
}

export function formatDM (d: Temporal.PlainDate): string {
	return `${formatD(d)} ${String(d.month).padStart(2, '0')}.`
}

export function formatDMY (d: Temporal.PlainDate): string {
	return `${formatDM(d)} ${d.year}`
}

export function formatMY (d: Temporal.PlainDate, locale?: string): string {
	return new Intl.DateTimeFormat(locale ?? navigator.language, { month: 'long', year: 'numeric' })
		.format(new Date(d.year, d.month - 1))
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export function isoWeekNumber (d: Temporal.PlainDate): number {
	return d.weekOfYear
}

export function sameDay (a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
	return Temporal.PlainDate.compare(a, b) === 0
}

export function sameMonth (a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
	return a.month === b.month && a.year === b.year
}

export function sameYear (a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
	return a.year === b.year
}

// ─── Parsing ─────────────────────────────────────────────────────────────────

export function parseDate (text: string): Temporal.PlainDate | null {
	if (!text || !text.trim()) return null

	try {
		// ISO format: yyyy-MM-dd
		const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)
		if (isoMatch) {
			return Temporal.PlainDate.from({ year: Number(isoMatch[1]), month: Number(isoMatch[2]), day: Number(isoMatch[3]) })
		}

		// Display format: dd. MM. yyyy (flexible spacing/separators)
		const displayMatch = text.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/)
		if (displayMatch) {
			return Temporal.PlainDate.from({ year: Number(displayMatch[3]), month: Number(displayMatch[2]), day: Number(displayMatch[1]) })
		}
	} catch {
		// invalid date
	}

	return null
}

// ─── Presets ─────────────────────────────────────────────────────────────────

export interface DatePreset<T> {
	label: string
	getValue: () => T
}

export function defaultDateRangePresets (opts?: { excludeCurrentPeriod?: boolean }): DatePreset<DateRange>[] {
	if (opts?.excludeCurrentPeriod) {
		return [
			{
				label: 'Today',
				getValue: () => {
					const today = Temporal.Now.plainDateISO()
					return { start: today, end: today.add({ days: 1 }) }
				}
			},
			{
				label: 'Yesterday',
				getValue: () => {
					const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 })
					return { start: yesterday, end: yesterday.add({ days: 1 }) }
				}
			},
			{
				label: 'Previous week',
				getValue: () => {
					const today = Temporal.Now.plainDateISO()
					const weekStart = startOfWeek(today, 'monday')
					return { start: weekStart.subtract({ weeks: 1 }), end: weekStart.subtract({ days: 1 }) }
				}
			},
			{
				label: 'Previous 4 weeks',
				getValue: () => {
					const today = Temporal.Now.plainDateISO()
					const weekStart = startOfWeek(today, 'monday')
					return { start: weekStart.subtract({ weeks: 4 }), end: endOfWeek(today, 'monday').subtract({ weeks: 1 }) }
				}
			},
			{
				label: 'Previous month',
				getValue: () => {
					const today = Temporal.Now.plainDateISO()
					const monthStart = startOfMonth(today)
					return {
						start: startOfMonth(monthStart.subtract({ months: 1 })),
						end: endOfMonth(monthStart.subtract({ months: 1 }))
					}
				}
			}
		]
	}

	return [
		{
			label: 'Today',
			getValue: () => {
				const today = Temporal.Now.plainDateISO()
				return { start: today, end: today }
			}
		},
		{
			label: 'Yesterday',
			getValue: () => {
				const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 })
				return { start: yesterday, end: yesterday }
			}
		},
		{
			label: 'Last 7 days',
			getValue: () => {
				const today = Temporal.Now.plainDateISO()
				return { start: today.subtract({ days: 6 }), end: today }
			}
		},
		{
			label: 'Last 14 days',
			getValue: () => {
				const today = Temporal.Now.plainDateISO()
				return { start: today.subtract({ days: 13 }), end: today }
			}
		},
		{
			label: 'Last 30 days',
			getValue: () => {
				const today = Temporal.Now.plainDateISO()
				return { start: today.subtract({ days: 29 }), end: today }
			}
		},
		{
			label: 'This month',
			getValue: () => {
				const today = Temporal.Now.plainDateISO()
				return { start: startOfMonth(today), end: today }
			}
		},
		{
			label: 'Last month',
			getValue: () => {
				const today = Temporal.Now.plainDateISO()
				const lastMonth = startOfMonth(today).subtract({ months: 1 })
				return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) }
			}
		}
	]
}

export function defaultDatePresets (): DatePreset<Temporal.PlainDate>[] {
	return [
		{
			label: 'Today',
			getValue: () => Temporal.Now.plainDateISO()
		},
		{
			label: 'Yesterday',
			getValue: () => Temporal.Now.plainDateISO().subtract({ days: 1 })
		}
	]
}
