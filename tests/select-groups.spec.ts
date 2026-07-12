import { test, expect } from '@playwright/test'

test.describe('Select — grouped options', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/components/select')
		await page.waitForLoadState('networkidle')
	})

	function groupedSelect (page) {
		return page.locator('.bunt-select').filter({ hasText: 'Group demo' }).first()
	}

	const dropdown = '#bunt-teleport-target'

	test('renders non-selectable group headers', async ({ page }) => {
		await groupedSelect(page).locator('input').click()

		const headers = page.locator(`${dropdown} .bunt-select-group-header`)
		await expect(headers).toHaveCount(3)
		await expect(headers.nth(0)).toHaveText('Fruits')
		await expect(headers.nth(1)).toHaveText('Vegetables')
		await expect(headers.nth(2)).toHaveText('Drinks')

		// options render and headers are not options
		await expect(page.locator(`${dropdown} li.bunt-select-option`)).toHaveCount(8)
	})

	test('clicking a header does not select; clicking an option does', async ({ page }) => {
		const input = groupedSelect(page).locator('input')
		await input.click()

		// clicking the header must not select / not close
		await page.locator(`${dropdown} .bunt-select-group-header`, { hasText: 'Fruits' }).click()
		await expect(page.locator(`${dropdown} li.bunt-select-option`).first()).toBeVisible()
		expect(await input.inputValue()).not.toBe('Fruits')

		// clicking an option selects it and closes
		await page.locator(`${dropdown} li.bunt-select-option`, { hasText: 'Banana' }).click()
		await expect(input).toHaveValue('Banana')
	})

	test('filtering drops empty groups; matching a header keeps its group', async ({ page }) => {
		const input = groupedSelect(page).locator('input')
		await input.click()

		// matches a single option -> only its group survives
		await input.fill('carrot')
		await expect(page.locator(`${dropdown} .bunt-select-group-header`)).toHaveCount(1)
		await expect(page.locator(`${dropdown} .bunt-select-group-header`)).toHaveText('Vegetables')
		await expect(page.locator(`${dropdown} li.bunt-select-option`)).toHaveCount(1)

		// matches a header -> whole group kept
		await input.fill('fruit')
		await expect(page.locator(`${dropdown} .bunt-select-group-header`)).toHaveText('Fruits')
		await expect(page.locator(`${dropdown} li.bunt-select-option`)).toHaveCount(3)
	})

	test('keyboard navigation skips headers, Enter selects, Esc closes', async ({ page }) => {
		const input = groupedSelect(page).locator('input')
		await input.click()

		// first ArrowDown highlights the first option, not a header
		await input.press('ArrowDown')
		await expect(page.locator(`${dropdown} li.bunt-select-option.highlighted`)).toHaveCount(1)
		await expect(page.locator(`${dropdown} li.bunt-select-option.highlighted`)).toHaveText('Apple')

		// move across the group boundary (Apple, Banana, Cherry, then Carrot in next group)
		await input.press('ArrowDown') // Banana
		await input.press('ArrowDown') // Cherry
		await input.press('ArrowDown') // Carrot (Vegetables)
		await expect(page.locator(`${dropdown} li.bunt-select-option.highlighted`)).toHaveText('Carrot')

		await input.press('Enter')
		await expect(input).toHaveValue('Carrot')

		// reopen and Escape closes without changing value
		await input.click()
		await expect(page.locator(`${dropdown} .bunt-select-group-header`).first()).toBeVisible()
		await input.press('Escape')
		await expect(page.locator(`${dropdown} .bunt-select-group-header`)).toHaveCount(0)
		await expect(input).toHaveValue('Carrot')
	})

	test('inline style is applied (no fragment attr-inheritance warning)', async ({ page }) => {
		const warnings = []
		page.on('console', msg => warnings.push(msg.text()))
		await page.reload({ waitUntil: 'networkidle' })

		// the style attr passed directly to <bunt-select> must reach the root element
		await expect(groupedSelect(page)).toHaveClass(/bunt-input--shape-rounded/)

		expect(warnings.filter(w => w.includes('Extraneous non-props attributes'))).toEqual([])
	})

	test('group slot wraps options without a manual loop', async ({ page }) => {
		const slotted = page.locator('.bunt-select').filter({ hasText: 'Group slot demo' }).first()
		const input = slotted.locator('input')
		await input.click()

		// custom wrapper markup from the #group slot is present, options still render and select
		await expect(page.locator(`${dropdown} li.bunt-select-option`, { hasText: 'Coffee' })).toBeVisible()
		await page.locator(`${dropdown} li.bunt-select-option`, { hasText: 'Coffee' }).click()
		await expect(input).toHaveValue('Coffee')
	})
})
