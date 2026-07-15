import { test, expect } from '@playwright/test'

// Regression for the bug where bunt-* components threw "Could not parse color"
// when the semantic tokens are defined with light-dark() (the single-source
// light/dark pattern). Two guarantees:
//  1. the JS bridge never receives an unresolvable token in a modern engine
//     (registered <color> @property resolves light-dark() to rgb());
//  2. the JS fallback (resolveThroughUA in utils/colors.ts) can resolve such
//     tokens on its own — the safety net for engines that don't resolve
//     registered <color> custom properties.
test.describe('light-dark() token theming', () => {
	test('mounting a button with light-dark() tokens logs no color-parse errors', async ({ page }) => {
		const errors: string[] = []
		page.on('console', (msg) => {
			if (msg.type() === 'error') errors.push(msg.text())
		})
		page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

		await page.goto('/components/button')
		await page.waitForLoadState('networkidle')

		await page.evaluate(() => {
			const r = document.documentElement
			r.style.colorScheme = 'dark'
			r.style.setProperty('--clr-primary', 'light-dark(#A02C55, #C73A66)')
			r.style.setProperty('--clr-danger', 'light-dark(#C13A2A, #F27059)')
			r.style.setProperty('--clr-success', 'light-dark(#1B7A42, #66C388)')
		})

		// make the button text-weight so the JS ink guard actually parses the accent
		await page.evaluate(() => {
			const el = document.querySelector('.bunt-button') as HTMLElement
			el.style.setProperty('--button-weight', 'text')
			document.documentElement.style.colorScheme = 'dark'
		})
		await expect(page.locator('.bunt-button').first()).toHaveClass(/bunt-button--weight-text/)

		const resolved = await page.evaluate(() => {
			const cs = getComputedStyle(document.querySelector('.bunt-button')!)
			return cs.getPropertyValue('--_button-color').trim()
		})
		// modern engine hands the bridge a resolved rgb(), never a raw token stream
		expect(resolved).toMatch(/^rgba?\(|^color\(|^okl(ab|ch)\(/)

		const colorErrors = errors.filter((e) => /parse color/i.test(e))
		expect(colorErrors, `unexpected color-parse errors:\n${colorErrors.join('\n')}`).toEqual([])
	})

	test('UA fallback resolves light-dark() and color-mix() to concrete colors', async ({ page }) => {
		await page.goto('/components/button')
		await page.waitForLoadState('networkidle')

		// mirrors resolveThroughUA(): apply the token to a probe and read it back.
		const resolve = (value: string, scheme: string) => page.evaluate(({ value, scheme }) => {
			const host = document.createElement('div')
			host.style.colorScheme = scheme
			document.body.appendChild(host)
			const probe = document.createElement('span')
			probe.style.color = value
			host.appendChild(probe)
			const out = getComputedStyle(probe).color
			host.remove()
			return out
		}, { value, scheme })

		// a concrete color the parser handles — rgb()/rgba() or the color(srgb …)
		// serialization Chromium emits for color-mix(), both parsed by parseColor()
		const concrete = /^(rgba?\(|color\(srgb )/

		const dark = await resolve('light-dark(#111111, #eeeeee)', 'dark')
		const light = await resolve('light-dark(#111111, #eeeeee)', 'light')
		expect(dark).toMatch(concrete)
		expect(light).toMatch(concrete)
		// dark scheme picks the light (#eee) side, light scheme the dark (#111) side
		expect(dark).not.toBe(light)

		const mixed = await resolve('color-mix(in srgb, red, blue)', 'light')
		expect(mixed).toMatch(concrete)
	})
})
