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

		const dayBtn = dialog.locator('[role="gridcell"] button:not(.disabled):not(.other-month)').first()
		await dayBtn.click()

		// Dialog should close
		await expect(dialog).not.toBeVisible()

		// The input shows the canonical ISO date; segmented editing is built on that layout
		// (src/utils/segmented-date-input.ts). Locale display is a later enhancement.
		const value = await input.inputValue()
		expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
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

	// FIXME(date-picker session): bunt-date-picker declares `clearable` but its template has no clear
	// button (handleClear is dead code), and the docs page currently renders a single showcase.
	test.fixme('clearable: × button clears value', async ({ page }) => {
		// "Clearable" section — second date picker on the page
		const picker = page.locator('.bunt-date-picker').nth(1)
		const input = picker.locator('input')

		// Open and select a day
		await input.click()
		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()
		await dialog.locator('[role="gridcell"] button:not(.disabled):not(.other-month)').first().click()
		await expect(dialog).not.toBeVisible()

		// Now value is set, clear button should appear
		await expect(picker.locator('.clear-trigger')).toBeVisible()
		await picker.locator('.clear-trigger').click()

		expect(await input.inputValue()).toBe('')
	})

	// FIXME(date-picker session): the calendar is unreachable from the keyboard. Every control inside the
	// popover has tabindex=-1 (CalendarMonth never receives autoFocus), so Tab leaves the component and the
	// popover closes. The old version of this test passed vacuously for exactly that reason. next-plan.md §7.3.
	test.fixme('keyboard: arrow keys navigate, Enter selects', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		const input = picker.locator('input')
		await input.click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()
		const initialValue = await input.inputValue()

		// Tab into the calendar grid: focus must land on a day cell inside the dialog
		await page.keyboard.press('Tab')
		await expect(dialog.locator('[role="gridcell"] button:focus')).toHaveCount(1)
		await page.keyboard.press('ArrowRight')
		await page.keyboard.press('ArrowRight')
		await page.keyboard.press('Enter')

		await expect(dialog).not.toBeVisible()
		const value = await input.inputValue()
		expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
		expect(value).not.toBe(initialValue)
	})

	// FIXME(date-picker session): bunt-date-picker declares `inline` but its template has no inline branch
	// (the range picker has one). The docs section for it is commented out.
	test.fixme('inline mode: renders without input', async ({ page }) => {
		const inlinePicker = page.locator('.bunt-date-picker__inline').last()
		await expect(inlinePicker).toBeVisible()
		await expect(inlinePicker.getByRole('grid')).toBeVisible()
	})

	// FIXME(date-picker session): the "Show week numbers" docs section is commented out, so this fixture
	// does not exist. Re-enable together with the docs page restructuring.
	test.fixme('week numbers column is visible when showWeekNumbers=true', async ({ page }) => {
		// "Show week numbers" picker — find by nearby heading text
		const picker = page.locator('.bunt-date-picker').filter({ hasText: 'Pick a date' }).nth(5)
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		await expect(dialog).toBeVisible()
		await expect(dialog.getByRole('columnheader', { name: 'Week' })).toBeVisible()
	})

	test('ARIA: day cells have aria-label with weekday name', async ({ page }) => {
		const picker = page.locator('.bunt-date-picker').first()
		await picker.locator('input').click()

		const dialog = page.getByRole('dialog', { name: 'Choose date' }).first()
		const firstCell = dialog.getByRole('gridcell').first()
		await expect(firstCell).toHaveAccessibleName(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/)
	})
})
