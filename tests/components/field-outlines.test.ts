import { test, expect } from '../support/fixtures'
import type { Locator } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.goto('/field-outlines')
})

// The notch must match the floating label as rendered: its untransformed width times the float scale, plus 8px clearance. offsetWidth rounds, so comparisons allow half a pixel.
function expectedGap (field: Locator) {
	return field.locator('label span').first().evaluate((span: HTMLElement) => span.offsetWidth * parseFloat(getComputedStyle(span).getPropertyValue('--_label-scale')) + 8)
}

function gap (outline: Locator) {
	return outline.evaluate(svg => parseFloat((svg as SVGElement).style.getPropertyValue('--label-gap')))
}

test('the notch matches the rendered label', async ({ page }) => {
	const field = page.getByTestId('normal')
	const width = await expectedGap(field)
	await expect.poll(() => gap(field.locator('svg.outline'))).toBeCloseTo(width, 0)
})

test('compact fields size the notch for their smaller label', async ({ page }) => {
	const normalOutline = page.getByTestId('normal').locator('svg.outline')
	await expect.poll(() => gap(normalOutline)).toBeGreaterThan(0)
	const normal = await gap(normalOutline)
	const compact = page.getByTestId('compact')
	await expect.poll(() => gap(compact.locator('svg.outline'))).toBeCloseTo(await expectedGap(compact), 0)
	expect(await gap(compact.locator('svg.outline'))).toBeLessThan(normal)
})

test('the notch follows label text and --font-stack changes', async ({ page }) => {
	const field = page.getByTestId('normal')
	const outline = field.locator('svg.outline')
	const initial = await gap(outline)
	await page.locator('#rename').click()
	await expect.poll(() => gap(outline)).toBeGreaterThan(initial)
	await expect.poll(async () => await gap(outline) - await expectedGap(field)).toBeCloseTo(0, 0)

	const proportional = await gap(outline)
	await field.evaluate(el => el.style.setProperty('--font-stack', 'monospace'))
	await expect.poll(() => gap(outline)).not.toBeCloseTo(proportional, 0)
	await expect.poll(async () => await gap(outline) - await expectedGap(field)).toBeCloseTo(0, 0)

	await page.locator('#relabel').click()
	await expect.poll(() => gap(outline)).toBe(0)
})

test('an open select keeps the notch width for its dropdown outline', async ({ page }) => {
	const field = page.getByTestId('select')
	const closed = await gap(field.locator('svg.outline'))
	expect(closed).toBeGreaterThan(8)
	await field.getByRole('combobox').click()
	await expect(page.getByRole('listbox')).toBeVisible()
	await expect(field.locator('label span').first()).toBeHidden()
	expect(await gap(page.locator('svg.dropdown-outline'))).toBeCloseTo(closed, 0)
	expect(await gap(field.locator('svg.outline'))).toBeCloseTo(closed, 0)
})
