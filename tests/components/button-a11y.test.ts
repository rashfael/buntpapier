import { test, expect, WCAG_TAGS, axeScan } from '../support/fixtures'

const CONSUMER = '.c-button-fixture'

test.beforeEach(async ({ page }) => {
	await page.goto('/buttons')
	await expect(page.getByRole('button', { name: 'Enabled action' })).toBeVisible()
})

test.describe('native button consumer', () => {
	test('Tab reaches the buttons and shows a focus ring', async ({ page }) => {
		await page.getByRole('button', { name: 'Before buttons' }).focus()
		await page.keyboard.press('Tab')

		const enabled = page.getByRole('button', { name: 'Enabled action' })
		await expect(enabled).toBeFocused()
		expect(await enabled.evaluate(el => el.matches(':focus-visible'))).toBe(true)
		expect(await enabled.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none')

		// aria-disabled keeps the button in the tab order on purpose, so its
		// state stays discoverable by keyboard users
		await page.keyboard.press('Tab')
		await expect(page.getByRole('button', { name: 'Disabled action' })).toBeFocused()
		await page.keyboard.press('Tab')
		await expect(page.getByRole('button', { name: 'Async action', exact: true })).toBeFocused()
	})

	test('Space and Enter activate; pointer activation agrees', async ({ page }) => {
		const enabled = page.getByRole('button', { name: 'Enabled action' })
		const activations = page.getByTestId('activations')

		await enabled.focus()
		await page.keyboard.press('Space')
		await expect(activations).toHaveText('1')
		await page.keyboard.press('Enter')
		await expect(activations).toHaveText('2')
		await enabled.click()
		await expect(activations).toHaveText('3')
	})

	test('a disabled button does not activate by keyboard or pointer', async ({ page }) => {
		const disabled = page.getByRole('button', { name: 'Disabled action' })
		const activations = page.getByTestId('activations')

		await expect(disabled).toBeDisabled()
		await disabled.focus()
		await page.keyboard.press('Space')
		await page.keyboard.press('Enter')
		// `force` skips Playwright's own enabled check so a real click reaches the
		// element — the component's guard, not the runner, has to refuse it
		await disabled.click({ force: true })
		await expect(activations).toHaveText('0')
	})

	test('enabled and disabled semantics are exposed', async ({ page }) => {
		await expect(page.getByRole('group', { name: 'Actions' })).toMatchAriaSnapshot(`
      - group "Actions":
        - button "Enabled action"
        - button "Disabled action" [disabled]
        - button "Async action"
    `)
	})

	test(`axe scan (${WCAG_TAGS.join(', ')}) finds no unexpected violation`, async ({ page }) => {
		const results = await axeScan(page, CONSUMER)
		// guard against a scan that silently inspected nothing
		expect(results.passes.length).toBeGreaterThan(0)
		expect(results.violations).toEqual([])
	})
})

test.describe('reduced motion', () => {
	test.use({ reducedMotion: 'reduce' })

	// UNMET CRITERION: accessibility acceptance item 8 requires reduced-motion handling, which the library lacks. This checks operation under emulation; M4 still owns motion suppression. See design/testing.md.
	test('activation and async lifecycle still complete', async ({ page }) => {
		expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true) // setup evidence only

		await page.getByRole('button', { name: 'Enabled action' }).focus()
		await page.keyboard.press('Enter')
		await expect(page.getByTestId('activations')).toHaveText('1')

		// The label is hidden during loading and success feedback, so retain the button through its test ID.
		const asyncAction = page.getByTestId('async-action')
		const starts = page.getByTestId('async-starts')
		const completions = page.getByTestId('async-completions')
		const complete = page.getByRole('button', { name: 'Complete async action' })
		await asyncAction.click()
		await expect(starts).toHaveText('1')
		await expect(completions).toHaveText('0')
		// Reach the component's own guard even if loading gains disabled semantics.
		await asyncAction.click({ force: true })
		await expect(starts).toHaveText('1')

		await complete.click()
		await expect(completions).toHaveText('1')
		await expect(asyncAction).toHaveAccessibleName('Async action')
		await asyncAction.click()
		await expect(starts).toHaveText('2')
		await complete.click()
		await expect(completions).toHaveText('2')
	})
})

test.describe('forced colours', () => {
	test.use({ forcedColors: 'active' })

	test('the consumer keeps keyboard operation and does not opt out of the system palette', async ({ page }) => {
		expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true) // setup evidence only

		const enabled = page.getByRole('button', { name: 'Enabled action' })
		await page.getByRole('button', { name: 'Before buttons' }).focus()
		await page.keyboard.press('Tab')
		await expect(enabled).toBeFocused()
		expect(await enabled.evaluate(el => el.matches(':focus-visible'))).toBe(true)
		// Not-opted-out guard: `forced-color-adjust: none` would suppress the UA's
		// high-contrast override. Read the property rather than the camelCase IDL
		// alias, which WebKit does not expose; an engine that does not implement the
		// property returns '', which leaves the guard vacuous there rather than wrong.
		expect(await enabled.evaluate(el => getComputedStyle(el).getPropertyValue('forced-color-adjust'))).not.toBe('none')

		await page.keyboard.press('Enter')
		await expect(page.getByTestId('activations')).toHaveText('1')

		await page.getByRole('button', { name: 'Disabled action' }).click({ force: true })
		await expect(page.getByTestId('activations')).toHaveText('1')
	})
})
