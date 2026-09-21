import { test, expect, axeScan } from '../support/fixtures'

test.beforeEach(async ({ page }) => {
	await page.goto('/field-boundaries')
})

test('adding and removing a hint slot updates the accessible description', async ({ page }) => {
	await page.locator('#slot').click()
	await expect(page.locator('#hint')).toHaveAccessibleDescription('Dynamic hint')
	await page.locator('#slot').click()
	await expect(page.locator('#hint')).toHaveAccessibleDescription('')
})

test('hiding an ancestor closes the popup and leaves the focus boundary once', async ({ page }) => {
	await page.locator('#select').click()
	await page.locator('#popup-button').focus()
	await page.locator('#hide').click()
	await expect(page.locator('output')).toHaveText('["focus","blur"]')
	await expect(page.getByRole('listbox')).toBeHidden()
})

test('disabling with popup focus transfers focus without leaving the boundary', async ({ page }) => {
	await page.locator('#select').click()
	await page.locator('#popup-button').focus()
	await page.locator('#toggle').click()
	await expect(page.locator('#select')).toBeFocused()
	await expect(page.locator('output')).toHaveText('["focus"]')
})

test('an open select retains valid listbox and option structure', async ({ page }) => {
	await page.locator('#select').click()
	const result = await axeScan(page, 'main')
	expect(result.violations).toEqual([])
})

test('the root hidden attribute hides its native entry', async ({ page }) => {
	await page.locator('#input').focus()
	await page.locator('#input').evaluate(el => el.closest('.bunt-input').setAttribute('hidden', ''))
	await expect(page.locator('#input')).toBeHidden()
})
