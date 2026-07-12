import type { Temporal } from '@js-temporal/polyfill'

export type SegmentName = 'year' | 'month' | 'day'

export interface Segment {
	name: SegmentName
	start: number
	end: number
	length: number
}

// Canonical YYYY-MM-DD layout. Locale reordering is a later enhancement.
const ISO_SEGMENTS: Segment[] = [
	{ name: 'year', start: 0, end: 4, length: 4 },
	{ name: 'month', start: 5, end: 7, length: 2 },
	{ name: 'day', start: 8, end: 10, length: 2 }
]

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/

export function parseSegments (_text?: string, _locale?: string): Segment[] {
	return ISO_SEGMENTS
}

export function isCanonicalISO (text: string): boolean {
	return ISO_RE.test(text)
}

export function getSegmentAt (segments: Segment[], caret: number): Segment | null {
	for (const s of segments) {
		if (caret >= s.start && caret <= s.end) return s
	}
	return null
}

export function adjacentSegment (segments: Segment[], current: Segment, direction: -1 | 1): Segment | null {
	const index = segments.findIndex((s) => s.name === current.name)
	if (index === -1) return null
	const next = index + direction
	if (next < 0 || next >= segments.length) return null
	return segments[next]
}

export function incrementDate (date: Temporal.PlainDate, segmentName: SegmentName, delta: number): Temporal.PlainDate {
	if (segmentName === 'day') return date.add({ days: delta })
	if (segmentName === 'month') return date.add({ months: delta })
	if (segmentName === 'year') return date.add({ years: delta })
	return date
}

export function segmentMax (name: SegmentName): number {
	if (name === 'day') return 31
	if (name === 'month') return 12
	if (name === 'year') return 9999
	return 0
}
