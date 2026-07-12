import { test, expect } from '@playwright/test'

test.describe('DateRangePicker', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components/date-range-picker')
		await page.waitForLoadState('networkidle')
	})

	test('renders the trigger input', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await expect(picker.locator('input')).toBeVisible()
	})

	test('opens dialog on input click', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await picker.locator('input').click()
		await expect(page.getByRole('dialog', { name: 'Choose date range' }).first()).toBeVisible()
	})

	test('two-click selection produces a range', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date range' }).first()
		await expect(dialog).toBeVisible()

		const days = dialog.locator('td button:not(.disabled):not(.other-month)')
		await days.nth(0).click()
		// Dialog still open after first click
		await expect(dialog).toBeVisible()
		await days.nth(4).click()
		await expect(dialog).not.toBeVisible()

		const value = await picker.locator('input').inputValue()
		expect(value).toBeTruthy()
		expect(value.length).toBeGreaterThan(5)
	})

	test('first click shows range-start class', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date range' }).first()
		await dialog.locator('td button:not(.disabled):not(.other-month)').first().click()

		await expect(dialog.locator('td button.range-start')).toBeVisible()
	})

	test('hover preview shows in-range class', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date range' }).first()
		const days = dialog.locator('td button:not(.disabled):not(.other-month)')

		await days.nth(0).click()
		await days.nth(5).hover()

		await expect(dialog.locator('td button.in-range').first()).toBeVisible()
	})

	test('clicking in reverse order produces correct sorted range', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date range' }).first()
		const days = dialog.locator('td button:not(.disabled):not(.other-month)')

		// Click later day first, then earlier day
		await days.nth(5).click()
		await days.nth(0).click()

		await expect(dialog).not.toBeVisible()
		const value = await picker.locator('input').inputValue()
		expect(value).toBeTruthy()
		expect(value.length).toBeGreaterThan(5)
	})

	test('Escape cancels in-progress selection', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date range' }).first()
		await dialog.locator('td button:not(.disabled):not(.other-month)').first().click()
		await expect(dialog).toBeVisible()

		await page.keyboard.press('Escape')
		await expect(dialog).not.toBeVisible()
	})

	test('clearable: × button clears value', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').nth(1)
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date range' }).first()
		const days = dialog.locator('td button:not(.disabled):not(.other-month)')
		await days.nth(0).click()
		await days.nth(4).click()
		await expect(dialog).not.toBeVisible()

		await expect(picker.locator('.clear-trigger')).toBeVisible()
		await picker.locator('.clear-trigger').click()

		expect(await picker.locator('input').inputValue()).toBe('')
	})

	test('inline mode: two months visible, range selection works', async ({ page }) => {
		const inlinePicker = page.locator('.bunt-date-range-picker__inline').last()
		await expect(inlinePicker).toBeVisible()

		// Should show 2 months by default
		await expect(inlinePicker.locator('table[role="grid"]')).toHaveCount(2)

		const days = inlinePicker.locator('td button:not(.disabled):not(.other-month)')
		await days.nth(0).click()
		await days.nth(4).click()

		await expect(inlinePicker.locator('td button.range-start, td button.range-end').first()).toBeVisible()
	})

	test('ARIA: grid has role=grid', async ({ page }) => {
		const picker = page.locator('.bunt-date-range-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date range' }).first()
		await expect(dialog.locator('table[role="grid"]').first()).toBeVisible()
	})
})
