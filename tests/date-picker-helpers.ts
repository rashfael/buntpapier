import { test as base, expect, type Locator, type Page } from '@playwright/test'

export const test = base.extend({
	page: async ({ page }, use) => {
		const errors = []
		page.on('pageerror', error => errors.push(error.message))
		await use(page)
		expect(errors).toEqual([])
	}
})

export async function loadDatePickers (page: Page) {
	await page.clock.install({ time: new Date('2026-09-16T12:00:00Z') })
	await page.goto('http://localhost:5174')
	await expect(page.getByRole('combobox', { name: 'Single date', exact: true })).toHaveValue('2026-09-16')
}

export function day (scope: Locator, iso: string) {
	const date = new Date(`${iso}T12:00:00Z`)
	const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
	const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
	return scope.getByRole('grid', { name: month, exact: true }).getByRole('button', { name: label, exact: true })
}

export const navigationCases = [
	['ArrowRight', '2026-09-17'],
	['ArrowLeft', '2026-09-15'],
	['ArrowDown', '2026-09-23'],
	['ArrowUp', '2026-09-09'],
	['Home', '2026-09-14'],
	['End', '2026-09-20'],
	['PageDown', '2026-10-16'],
	['PageUp', '2026-08-16'],
	['Shift+PageDown', '2027-09-16'],
	['Shift+PageUp', '2025-09-16']
]
