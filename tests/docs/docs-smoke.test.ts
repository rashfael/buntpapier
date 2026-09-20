import { test, expect, type PageLog } from '../support/fixtures'

// Documentation integration only. Component contracts are asserted against owned
// fixtures in tests/components; these cases check that the docs pages mount
// without runtime errors and that their examples still respond.
test.use({ locale: 'en-US', timezoneId: 'UTC' })

function noVueWarnings (pageLog: PageLog) {
	expect(pageLog.vueWarnings, `unexpected Vue warnings:\n${pageLog.vueWarnings.join('\n')}`).toEqual([])
}

test.describe('docs smoke', () => {
	for (const component of ['date-picker', 'date-range-picker']) {
		test(`${component} docs mount without runtime errors and have editable examples`, async ({ page, pageLog }) => {
			// the same frozen clock the picker fixture uses, so the docs examples
			// render a stable month
			await page.clock.install({ time: new Date('2026-09-16T12:00:00Z') })
			await page.goto(`/components/${component}`)
			const showcases = page.locator('.c-showcase')
			await expect(showcases.first().getByRole('combobox')).toBeVisible()
			await expect(showcases.last().getByRole('grid').first()).toBeVisible()
			const inputBox = await showcases.first().getByRole('combobox').boundingBox()
			const iconBox = await showcases.first().getByRole('button', { name: 'Open calendar' }).boundingBox()
			expect(Math.abs(inputBox.y + inputBox.height / 2 - iconBox.y - iconBox.height / 2)).toBeLessThan(2)
			for (const showcase of [showcases.first(), showcases.last()]) {
				const pane = await showcase.locator('.component').boundingBox()
				const picker = await showcase.locator(`.bunt-${component}`).boundingBox()
				const surface = await showcase.locator('.surface-control').boundingBox()
				expect(picker.x).toBeGreaterThanOrEqual(pane.x)
				expect(picker.x + picker.width).toBeLessThanOrEqual(pane.x + pane.width)
				expect(picker.y).toBeGreaterThanOrEqual(surface.y + surface.height)
			}
			await showcases.first().getByRole('combobox').click()
			await expect(page.getByRole('dialog')).toBeVisible()
			await page.keyboard.press('Escape')
			if (component === 'date-range-picker') {
				await showcases.first().getByRole('spinbutton').fill('1')
				await showcases.first().getByRole('combobox').click()
				await expect(page.getByRole('dialog').getByRole('grid')).toHaveCount(1)
			}
			noVueWarnings(pageLog)
		})
	}

	test('button docs mount without runtime errors and the playground is editable', async ({ page, pageLog }) => {
		await page.goto('/components/button')
		const playground = page.locator('.c-showcase').first()
		await expect(playground.locator('.component .bunt-button')).toBeVisible()
		// every showcase can switch its demo surface
		await playground.locator('.surface-control button', { hasText: 'dark' }).click()
		await expect(playground.locator('.component')).toHaveCSS('color-scheme', 'dark')
		// an editable boolean prop reaches the rendered component
		await playground.locator('.prop', { hasText: 'disabled' }).locator('input[type=checkbox]').check()
		await expect(playground.locator('.component .bunt-button')).toHaveAttribute('aria-disabled', 'true')
		noVueWarnings(pageLog)
	})

	test('checkbox docs mount without runtime errors and the examples respond', async ({ page, pageLog }) => {
		await page.goto('/components/checkbox')
		const playground = page.locator('.c-showcase').first()
		const checkbox = playground.locator('.component .bunt-checkbox')
		await expect(checkbox).toBeVisible()
		// the playground binds v-model through the showcase, so its starting state
		// follows the docs definition — assert the toggle, not a fixed value
		const input = checkbox.locator('input[type=checkbox]')
		const before = await input.isChecked()
		await checkbox.locator('label').click()
		await expect(input).toBeChecked({ checked: !before })
		noVueWarnings(pageLog)
	})

	test('select docs mount without runtime errors and the dropdown reaches the teleport target', async ({ page, pageLog }) => {
		await page.goto('/components/select')
		const playground = page.locator('.c-showcase').first()
		await expect(playground.locator('.component .bunt-select')).toBeVisible()
		// the docs page has to provide the teleport host the dropdown renders into
		await expect(page.locator('#bunt-teleport-target')).toHaveCount(1)
		await playground.locator('.component .bunt-select input').click()
		await expect(page.locator('#bunt-teleport-target li.bunt-select-option')).toHaveCount(3)
		await page.keyboard.press('Escape')
		noVueWarnings(pageLog)
	})
})
