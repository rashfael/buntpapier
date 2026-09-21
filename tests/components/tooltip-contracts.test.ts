import { test, expect } from '../support/fixtures'

test.beforeEach(async ({ page }) => {
	await page.goto('/tooltip-contracts')
})

async function counts (page) {
	return JSON.parse(await page.locator('#counts').textContent())
}

async function clickTooltip (page, target: string) {
	await page.locator(target).hover()
	await page.waitForTimeout(250)
	const box = await page.locator('.bunt-tooltip').boundingBox()
	await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
}

test('tooltip pixels do not activate their button, submit or link owners', async ({ page }) => {
	for (const target of ['#submit-trigger', '#native-trigger', '#link-trigger']) {
		await clickTooltip(page, target)
		await page.mouse.move(0, 0)
		await expect(page.locator('.bunt-tooltip')).toHaveCount(0)
	}
	expect(await counts(page)).toEqual({ buttonClicks: 0, submits: 0, linkClicks: 0, behindClicks: 0 })
	expect(new URL(page.url()).hash).toBe('')
	await expect(page.locator('#submit-trigger')).not.toBeFocused()
	await expect(page.locator('#native-trigger')).not.toBeFocused()
	await expect(page.locator('#link-trigger')).not.toBeFocused()
})

test('forced tooltip pixels and the former surrounding halo click through', async ({ page }) => {
	await page.getByRole('button', { name: 'Set error' }).click()
	const tooltip = page.locator('.bunt-tooltip')
	await tooltip.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)))
	const box = await tooltip.boundingBox()
	const x = box.x + box.width / 2
	for (const y of [box.y + box.height / 2, box.y + box.height + 4]) {
		await page.locator('#behind').evaluate((element, point) => {
			Object.assign((element as HTMLElement).style, { left: `${point.x - 2}px`, top: `${point.y - 2}px`, width: '4px', height: '4px' })
		}, { x, y })
		await page.mouse.click(x, y)
	}
	expect(await counts(page)).toEqual({ buttonClicks: 0, submits: 0, linkClicks: 0, behindClicks: 2 })
})

test('slide and fade animation reverses safely and unmount disposes it', async ({ page, pageLog }) => {
	const trigger = page.locator('#native-trigger')
	await trigger.hover()
	const tooltip = page.locator('.bunt-tooltip')
	await expect(tooltip).toBeVisible()
	await expect.poll(() => tooltip.evaluate(element => element.getAnimations().length)).toBe(1)
	const animation = await tooltip.evaluate(element => {
		const current = element.getAnimations()[0]
		const keyframes = (current.effect as KeyframeEffect).getKeyframes()
		return {
			duration: (current.effect as KeyframeEffect).getTiming().duration,
			easing: (current.effect as KeyframeEffect).getTiming().easing,
			opacities: keyframes.map(frame => frame.opacity),
			transforms: keyframes.map(frame => frame.transform)
		}
	})
	expect(animation.duration).toBe(200)
	expect(animation.easing).toBe('ease-in-out')
	expect(animation.opacities).toEqual(['0', '1'])
	expect(animation.transforms).toHaveLength(2)
	await page.mouse.move(0, 0)
	await expect.poll(() => tooltip.evaluate(element => element.getAnimations()[0]?.playbackRate)).toBe(-1)
	await trigger.hover()
	await expect.poll(() => tooltip.evaluate(element => element.getAnimations()[0]?.playbackRate)).toBe(1)
	await page.mouse.move(0, 0)
	await expect(tooltip).toHaveCount(0)
	await trigger.hover()
	await page.getByRole('button', { name: 'Remove triggers' }).click()
	await expect(tooltip).toHaveCount(0)
	expect(pageLog.consoleErrors).toEqual([])
})

test('pointer focus and activation do not pin an ordinary tooltip', async ({ page }) => {
	const before = page.locator('#before')
	const trigger = page.locator('#native-trigger')
	await before.focus()
	await page.keyboard.press('Tab')
	await page.keyboard.press('Tab')
	await expect(trigger).toBeFocused()
	await expect(page.getByRole('tooltip')).toHaveText('Ordinary explanation')
	await trigger.click()
	await expect(page.getByRole('tooltip')).toHaveCount(0)
	await page.mouse.move(0, 0)
	await trigger.hover()
	await expect(page.getByRole('tooltip')).toBeVisible()
	await page.mouse.move(0, 0)
	await expect(page.getByRole('tooltip')).toHaveCount(0)
})

test('keyboard focus opens and blur or Escape dismisses until a new interaction', async ({ page }) => {
	const trigger = page.locator('#native-trigger')
	await page.locator('#before').focus()
	await page.keyboard.press('Tab')
	await page.keyboard.press('Tab')
	await expect(page.getByRole('tooltip')).toHaveText('Ordinary explanation')
	await page.keyboard.press('Escape')
	await expect(page.getByRole('tooltip')).toHaveCount(0)
	await page.getByRole('button', { name: /Rerender/ }).click()
	await expect(page.getByRole('tooltip')).toHaveCount(0)
	await trigger.focus()
	await expect(page.getByRole('tooltip')).toHaveText('Ordinary explanation')
	await page.locator('#before').focus()
	await expect(page.getByRole('tooltip')).toHaveCount(0)
})

test('forced errors survive inactivity, stay dismissed across rerenders and reopen for new errors', async ({ page }) => {
	const error = page.locator('#error-trigger')
	await page.getByRole('button', { name: 'Set error' }).click()
	await page.mouse.move(0, 0)
	await expect(page.getByRole('tooltip')).toHaveText('Failed action')
	await expect(error).toHaveAccessibleDescription('Failed action')
	await page.keyboard.press('Escape')
	await expect(page.getByRole('tooltip')).toHaveCount(0)
	await page.getByRole('button', { name: /Rerender/ }).click()
	await expect(page.getByRole('tooltip')).toHaveCount(0)
	await page.getByRole('button', { name: 'Change error' }).click()
	await expect(page.getByRole('tooltip')).toHaveText('Changed failure')
	await page.keyboard.press('Escape')
	await page.getByRole('button', { name: 'Clear error' }).click()
	await page.getByRole('button', { name: 'Change error' }).click()
	await expect(page.getByRole('tooltip')).toHaveText('Changed failure')
})

test('composable separates its anchor and control, reacts to content and stops cleanly', async ({ page, pageLog }) => {
	const control = page.locator('#composed-control')
	await control.focus()
	await expect(page.getByRole('tooltip')).toHaveText('Composed explanation')
	await expect(control).toHaveAccessibleDescription('Existing description Composed explanation')
	await expect(page.locator('#composed-anchor')).not.toHaveAttribute('aria-describedby')
	await page.keyboard.press('Escape')
	await expect(page.getByRole('tooltip')).toHaveCount(0)
	await expect(control).toHaveAttribute('aria-describedby', 'existing-description')
	await page.locator('#composed-change').click()
	await expect(page.getByRole('tooltip')).toHaveText('Updated explanation')
	await expect(control).toHaveAccessibleDescription('Existing description Updated explanation')
	await page.locator('#composed-stop').click()
	await expect(page.locator('.bunt-tooltip')).toHaveCount(0)
	await expect(control).toHaveAttribute('aria-describedby', 'existing-description')
	await control.focus()
	await expect(page.locator('.bunt-tooltip')).toHaveCount(0)
	expect(pageLog.consoleErrors).toEqual([])
})

test('composable releases and rebinds replaced controls and anchors', async ({ page, pageLog }) => {
	await page.locator('#composed-change').click()
	await expect(page.getByRole('tooltip')).toHaveText('Updated explanation')
	for (const toggle of ['#composed-toggle-control', '#composed-toggle-anchor']) {
		await page.locator(toggle).click()
		await expect(page.locator('.bunt-tooltip')).toHaveCount(0)
		await page.locator(toggle).click()
		await expect(page.getByRole('tooltip')).toHaveText('Updated explanation')
		await expect(page.locator('#composed-control')).toHaveAccessibleDescription('Existing description Updated explanation')
	}
	expect(pageLog.consoleErrors).toEqual([])
})

test('hover-only explanation dismisses with Escape while focus is outside', async ({ page }) => {
	await page.locator('#before').focus()
	await page.locator('#native-trigger').hover()
	await expect(page.getByRole('tooltip')).toBeVisible()
	await page.keyboard.press('Escape')
	await expect(page.getByRole('tooltip')).toBeHidden()
	await expect(page.locator('#before')).toBeFocused()
})

test('hover explanation closes when the pointer leaves its trigger', async ({ page }) => {
	await page.locator('#before').focus()
	await page.locator('#native-trigger').hover()
	const tooltip = page.getByRole('tooltip')
	await expect(tooltip).toBeVisible()
	await page.mouse.move(0, 0)
	await expect(tooltip).toHaveCount(0)
})

test('inline directive updates content and preserves caller descriptions', async ({ page }) => {
	const trigger = page.locator('#native-trigger')
	await trigger.focus()
	await expect(trigger).toHaveAccessibleDescription('Existing description Ordinary explanation')
	await page.locator('#change-text').evaluate((element: HTMLButtonElement) => element.click())
	await expect(page.getByRole('tooltip')).toHaveText('Changed explanation')
	await expect(trigger).toHaveAccessibleDescription('Existing description Changed explanation')
	await page.keyboard.press('Escape')
	await expect(trigger).toHaveAttribute('aria-describedby', 'existing-description')
})
