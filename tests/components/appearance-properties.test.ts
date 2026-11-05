import { test, expect } from '../support/fixtures'

// The appearance properties for pressed buttons, the select's indicator and dropdown, field boxes,
// checkbox boxes and overlays: unset, each keeps the shipped rendering; set on an ancestor or the
// element, each reaches the part it names, including the dropdown teleported out of the field.
test.describe('appearance properties', () => {
	test('a button keeps its shipped pressed look, and takes a shadow, a pressed shadow and an offset', async ({ page }) => {
		await page.goto('/buttons')
		const button = page.locator('.bunt-button').filter({ hasText: 'Enabled action' })
		await expect(button).toBeVisible()
		const look = () => button.evaluate(element => ({
			shadow: getComputedStyle(element).boxShadow,
			background: getComputedStyle(element).backgroundColor,
			translate: getComputedStyle(element.querySelector('.bunt-button-content')!).translate
		}))
		const pressed = async () => {
			const box = (await button.boundingBox())!
			await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
			await page.mouse.down()
			const result = await look()
			await page.mouse.up()
			await page.mouse.move(0, 0)
			return result
		}

		const rest = await look()
		expect(rest).toMatchObject({ shadow: 'none', translate: 'none' })
		const shipped = await pressed()
		expect(shipped).toMatchObject({ shadow: 'none', translate: 'none' })
		expect(shipped.background, 'the shipped pressed face is darker').not.toBe(rest.background)

		await button.evaluate(element => {
			element.style.setProperty('--button-shadow', 'inset 1px 1px 0 rgb(255, 255, 255)')
			element.style.setProperty('--button-shadow-pressed', 'inset 1px 1px 0 rgb(0, 0, 0)')
			element.style.setProperty('--button-pressed-offset', '1px 1px')
			element.style.setProperty('--button-color-pressed', 'rgb(1, 2, 3)')
		})
		expect((await look()).shadow).toBe('rgb(255, 255, 255) 1px 1px 0px 0px inset')
		expect(await pressed()).toEqual({ shadow: 'rgb(0, 0, 0) 1px 1px 0px 0px inset', background: 'rgb(1, 2, 3)', translate: '1px 1px' })
	})

	test('a select draws no indicator by default, and an indicator, field box and dropdown surface when set', async ({ page }) => {
		await page.goto('/selects')
		const select = page.locator('.bunt-select').filter({ hasText: 'Grouped options' }).first()
		await expect(select).toBeVisible()
		const container = select.locator('> .label-input-container')
		const indicator = () => container.evaluate(element => {
			const style = getComputedStyle(element, '::after')
			return { content: style.content, width: style.width, shadow: style.boxShadow }
		})
		expect((await indicator()).content).toBe('none')
		expect(await container.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')

		await page.evaluate(() => {
			const root = document.documentElement.style
			root.setProperty('--select-indicator', '""')
			root.setProperty('--select-indicator-width', '20px')
			root.setProperty('--select-indicator-shadow', 'rgb(255, 255, 255) 1px 1px 0px 0px inset')
			root.setProperty('--select-indicator-shadow-open', 'rgb(0, 0, 0) 1px 1px 0px 0px inset')
			root.setProperty('--input-background', 'rgb(250, 250, 250)')
			root.setProperty('--overlay-background', 'rgb(240, 240, 240)')
			root.setProperty('--overlay-shadow', 'rgb(0, 0, 0) 3px 3px 0px 0px')
			root.setProperty('--select-dropdown-border', '1px solid rgb(0, 0, 0)')
		})
		expect(await indicator()).toEqual({ content: '""', width: '20px', shadow: 'rgb(255, 255, 255) 1px 1px 0px 0px inset' })
		expect(await container.evaluate(element => getComputedStyle(element).paddingRight)).toBe('20px')
		expect(await container.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(250, 250, 250)')

		await select.locator('input').click()
		const menu = page.locator('#bunt-teleport-target .bunt-select-dropdown-menu')
		await expect(menu).toBeVisible()
		expect((await indicator()).shadow, 'the open state').toBe('rgb(0, 0, 0) 1px 1px 0px 0px inset')
		expect(await menu.evaluate(element => ({
			shadow: getComputedStyle(element).boxShadow,
			background: getComputedStyle(element.querySelector('.scrollable-menu')!).backgroundColor,
			border: getComputedStyle(element.querySelector('.scrollable-menu')!).borderLeft,
			// the field's copy at the dropdown's top paints no field box over the field
			copy: getComputedStyle(element.querySelector('.bunt-select .label-input-container')!).backgroundColor
		}))).toEqual({ shadow: 'rgb(0, 0, 0) 3px 3px 0px 0px', background: 'rgb(240, 240, 240)', border: '1px solid rgb(0, 0, 0)', copy: 'rgba(0, 0, 0, 0)' })
	})

	test('a squared field\'s outline has no corner arcs, so its notch appears once', async ({ page }) => {
		await page.goto('/selects')
		const select = page.locator('.bunt-select').filter({ hasText: 'Grouped options' }).first()
		await expect(select).toBeVisible()
		await select.evaluate(element => (element as HTMLElement).style.setProperty('--input-shape', 'squared'))
		await page.evaluate(() => document.documentElement.style.setProperty('--refresh', '1'))
		await expect(select).toHaveClass(/bunt-input--shape-squared/)
		await expect.poll(() => select.locator('svg.outline path').getAttribute('d')).not.toMatch(/a/)
	})
})
