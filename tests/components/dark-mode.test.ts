import { test, expect } from '../support/fixtures'

// WCAG relative luminance + contrast, for asserting the ink guard
function parseColor (str: string) {
	let match = str.match(/rgba?\(([\d.]+),?\s*([\d.]+),?\s*([\d.]+)(?:[,/]\s*([\d.]+))?\)/)
	if (match) return { r: +match[1], g: +match[2], b: +match[3], a: match[4] === undefined ? 1 : +match[4] }
	match = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/)
	if (match) return { r: +match[1] * 255, g: +match[2] * 255, b: +match[3] * 255, a: match[4] === undefined ? 1 : +match[4] }
	// color-mix(in oklab, ...) results serialize in oklab — expose L as a proxy
	match = str.match(/okl(?:ab|ch)\(([\d.]+)/)
	if (match) return { oklabL: +match[1], a: 1 }
	throw new Error(`cannot parse color: ${str}`)
}

function isDarkColor (str: string) {
	const color = parseColor(str)
	if (color.oklabL !== undefined) return color.oklabL < 0.5
	return luminance(color) < 0.3
}

function luminance ({ r, g, b }) {
	const [lr, lg, lb] = [r, g, b].map((channel) => {
		const c = channel / 255
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
	})
	return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

function contrast (foreground: string, background: string) {
	const fg = parseColor(foreground)
	const bg = parseColor(background)
	// blend semi-transparent foregrounds onto the background
	const blended = {
		r: fg.r * fg.a + bg.r * (1 - fg.a),
		g: fg.g * fg.a + bg.g * (1 - fg.a),
		b: fg.b * fg.a + bg.b * (1 - fg.a)
	}
	const l1 = luminance(blended)
	const l2 = luminance(bg)
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

test.beforeEach(async ({ page }) => {
	await page.goto('/theming')
	await expect(page.locator('.bunt-button').first()).toBeVisible()
})

test.describe('dark mode', () => {
	test('derived surface and text tokens flip with color-scheme', async ({ page }) => {
		const read = () => page.evaluate(() => {
			const el = document.querySelector('.bunt-button')!
			const computed = getComputedStyle(el)
			return {
				surface: computed.getPropertyValue('--_clr-surface'),
				text: getComputedStyle(document.body).color
			}
		})

		const light = await read()
		expect(luminance(parseColor(light.surface))).toBeGreaterThan(0.9)

		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark'
		})
		const dark = await read()
		expect(luminance(parseColor(dark.surface))).toBeLessThan(0.1)
	})

	test('filled button text color follows contrast-color() of its fill (pure CSS)', async ({ page }) => {
		const textOn = (fill: string) => page.evaluate((fillColor) => {
			const el = document.querySelector('.bunt-button') as HTMLElement
			el.style.setProperty('--button-color', fillColor)
			return getComputedStyle(el).color
		}, fill)

		// yellow fill → black text
		expect(luminance(parseColor(await textOn('#ffeb3b')))).toBeLessThan(0.1)
		// indigo-900 fill → white text
		expect(luminance(parseColor(await textOn('#1a237e')))).toBeGreaterThan(0.9)
	})

	test('per-subtree theming: checkbox in a dark wrapper gets white-based border', async ({ page }) => {
		// uncheck the checkbox — checked boxes show the solid accent fill
		await page.locator('.bunt-checkbox label').first().click()
		await expect(page.locator('.bunt-checkbox').first()).not.toHaveClass(/checked/)
		await expect(page.getByTestId('checkbox-value')).toHaveText('unchecked')

		await page.evaluate(() => {
			const checkbox = document.querySelector('.bunt-checkbox:not(.checked):not(.disabled)')!
			const wrapper = document.createElement('div')
			wrapper.dataset.darkWrapper = ''
			wrapper.style.colorScheme = 'dark'
			checkbox.parentElement!.insertBefore(wrapper, checkbox)
			wrapper.appendChild(checkbox)
		})
		const readBorder = () => page.evaluate(() =>
			getComputedStyle(document.querySelector('[data-dark-wrapper] .bunt-checkbox-box')!).borderColor)
		// the box has `transition: all`, so poll past the color transition
		await expect.poll(async () => parseColor(await readBorder()).r).toBeGreaterThan(200) // white-based ink
		expect(parseColor(await readBorder()).a).toBeLessThan(1) // emphasis alpha, not solid white
	})

	test('theme watcher: text-weight button ink updates after a theme flip', async ({ page }) => {
		// make the button text-weight; the style-attribute change on <html>
		// below triggers the theme watcher, which re-reads the weight too
		await page.evaluate(() => {
			const el = document.querySelector('.bunt-button') as HTMLElement
			el.style.setProperty('--button-weight', 'text')
			document.documentElement.style.colorScheme = 'light'
		})
		await expect(page.locator('.bunt-button').first()).toHaveClass(/bunt-button--weight-text/)

		const lightInk = await page.evaluate(() => getComputedStyle(document.querySelector('.bunt-button')!).color)

		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark'
		})
		// recompute is observer-driven — poll until the ink changes
		await expect.poll(async () => {
			return page.evaluate(() => getComputedStyle(document.querySelector('.bunt-button')!).color)
		}).not.toBe(lightInk)

		const darkInk = await page.evaluate(() => getComputedStyle(document.querySelector('.bunt-button')!).color)
		expect(contrast(darkInk, 'rgb(18, 18, 18)')).toBeGreaterThanOrEqual(3)
	})

	test('contrast guard: yellow text-weight button stays readable on light surface', async ({ page }) => {
		await page.evaluate(() => {
			const el = document.querySelector('.bunt-button') as HTMLElement
			el.style.setProperty('--button-weight', 'text')
			el.style.setProperty('--button-color', '#ffeb3b')
			// nudge the theme watcher so the new custom properties get re-read
			document.documentElement.style.colorScheme = 'light'
		})
		await expect(page.locator('.bunt-button').first()).toHaveClass(/bunt-button--weight-text/)

		await expect.poll(async () => {
			const ink = await page.evaluate(() => getComputedStyle(document.querySelector('.bunt-button')!).color)
			return contrast(ink, 'rgb(255, 255, 255)')
		}).toBeGreaterThanOrEqual(3)
	})

	test('outlined hover wash derives from currentcolor', async ({ page }) => {
		await page.evaluate(() => {
			const el = document.querySelector('.bunt-button') as HTMLElement
			el.style.setProperty('--button-weight', 'outlined')
			document.documentElement.style.colorScheme = 'light'
		})
		const button = page.locator('.bunt-button').first()
		await expect(button).toHaveClass(/bunt-button--weight-outlined/)

		await button.hover()
		const { wash, ink } = await page.evaluate(() => {
			const el = document.querySelector('.bunt-button')!
			const computed = getComputedStyle(el)
			return { wash: computed.backgroundColor, ink: computed.color }
		})
		const washColor = parseColor(wash)
		const inkColor = parseColor(ink)
		expect(washColor.a).toBeCloseTo(0.08, 1)
		// the wash carries the ink's hue, not the raw accent's
		expect(Math.abs(washColor.r - inkColor.r)).toBeLessThan(2)
		expect(Math.abs(washColor.g - inkColor.g)).toBeLessThan(2)
		expect(Math.abs(washColor.b - inkColor.b)).toBeLessThan(2)
	})

	test('teleported select dropdown follows a dark trigger subtree', async ({ page }) => {
		// wrap the select in a dark subtree
		await page.evaluate(() => {
			const select = document.querySelector('.bunt-select')!
			const wrapper = document.createElement('div')
			wrapper.style.colorScheme = 'dark'
			select.parentElement!.insertBefore(wrapper, select)
			wrapper.appendChild(select)
		})

		await page.locator('.bunt-select').first().locator('input').click()
		const menu = page.locator('#bunt-teleport-target .scrollable-menu')
		await expect(menu).toBeVisible()
		const background = await menu.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(isDarkColor(background)).toBe(true) // raised dark surface, not white
	})

	test('date-picker popover renders on the raised surface and flips', async ({ page }) => {
		await page.evaluate(() => {
			document.documentElement.style.colorScheme = 'dark'
		})
		await page.locator('.bunt-date-picker .open-calendar-btn, .bunt-date-picker input').first().click()
		const popover = page.locator('.bunt-date-picker [popover]').first()
		await expect(popover).toBeVisible()
		const background = await popover.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(isDarkColor(background)).toBe(true)
	})
})

test.describe('performance', () => {
	test('theme flip style-recalc on a 10k-node page stays sane', async ({ page }) => {
		const duration = await page.evaluate(() => {
			const host = document.createElement('div')
			for (let i = 0; i < 10000; i++) {
				const node = document.createElement('div')
				node.textContent = `node ${i}`
				host.appendChild(node)
			}
			document.body.appendChild(host)
			// settle initial style
			void getComputedStyle(host.lastElementChild!).color

			document.documentElement.style.colorScheme = 'dark'
			const start = performance.now()
			// force a synchronous full style recalc
			void getComputedStyle(host.lastElementChild!).color
			return performance.now() - start
		})
		console.log(`theme-flip recalc with 10k extra nodes: ${duration.toFixed(1)}ms`)
		expect(duration).toBeLessThan(1500) // generous bound — informational, not a perf gate
	})
})
