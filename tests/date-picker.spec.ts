import { test, expect } from '@playwright/test'

test.describe('DatePicker', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components/date-picker')
		await page.waitForLoadState('networkidle')
	})

	test('renders the trigger input', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		await expect(picker.locator('input')).toBeVisible()
	})

	test('opens dialog on input click', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		await picker.locator('input').click()
		await expect(page.getByRole('dialog', { name: 'Choose date' }).first()).toBeVisible()
	})

	test('clicking a day closes dialog and updates value', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		const input = picker.locator('input')
		await input.click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()

		const dayBtn = dialog.locator('td button:not(.disabled):not(.other-month)').first()
		await dayBtn.click()

		// Dialog should close
		await expect(dialog).not.toBeVisible()

		// Input should show a formatted date value
		const value = await input.inputValue()
		expect(value).toBeTruthy()
		expect(value).toMatch(/\d{2}\. \d{2}\. \d{4}/)
	})

	test('Escape closes dialog without changing value', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		const input = picker.locator('input')
		await input.click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()

		const initialValue = await input.inputValue()
		await page.keyboard.press('Escape')
		await expect(dialog).not.toBeVisible()

		const afterValue = await input.inputValue()
		expect(afterValue).toBe(initialValue)
	})

	test('clearable: × button clears value', async ({ page }) => {
		// "Clearable" section — second date picker on the page
		const picker = page.locator('.bunt-date-picker').nth(1)
		const input = picker.locator('input')

		// Open and select a day
		await input.click()
		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()
		await dialog.locator('td button:not(.disabled):not(.other-month)').first().click()
		await expect(dialog).not.toBeVisible()

		// Now value is set, clear button should appear
		await expect(picker.locator('.clear-trigger')).toBeVisible()
		await picker.locator('.clear-trigger').click()

		expect(await input.inputValue()).toBe('')
	})

	test('keyboard: arrow keys navigate, Enter selects', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()

		// Tab into the calendar grid
		await page.keyboard.press('Tab')
		await page.keyboard.press('ArrowRight')
		await page.keyboard.press('ArrowRight')
		await page.keyboard.press('Enter')

		await expect(dialog).not.toBeVisible()
		const value = await picker.locator('input').inputValue()
		expect(value).toMatch(/\d{2}\. \d{2}\. \d{4}/)
	})

	test('inline mode: renders without input', async ({ page }) => {
		const inlinePicker = page.locator('.bunt-date-picker__inline').last()
		await expect(inlinePicker).toBeVisible()
		await expect(inlinePicker.locator('table[role="grid"]')).toBeVisible()
	})

	test('week numbers column is visible when showWeekNumbers=true', async ({ page }) => {
		// "Show week numbers" picker — find by nearby heading text
		const picker = page.locator('.bunt-date-picker').filter({ hasText: 'Pick a date' }).nth(5)
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()
		await expect(dialog.locator('th[aria-label="Week"]')).toBeVisible()
	})

	test('ARIA: day cells have aria-label with weekday name', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		const firstCell = dialog.locator('td[role="gridcell"]').first()
		const ariaLabel = await firstCell.getAttribute('aria-label')
		expect(ariaLabel).toMatch(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/)
	})
})
