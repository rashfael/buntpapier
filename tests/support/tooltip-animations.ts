import type { Page } from '@playwright/test'

declare global {
	interface Window {
		tooltipAnimations: Animation[]
	}
}

// Retain animations after they finish or are cancelled; getAnimations() can miss the entire 200ms animation on a loaded runner.
export async function recordTooltipAnimations (page: Page) {
	await page.addInitScript(() => {
		window.tooltipAnimations = []
		const animate = Element.prototype.animate
		Element.prototype.animate = function (this: Element, ...args) {
			const animation = animate.apply(this, args)
			if (this.classList.contains('bunt-tooltip')) window.tooltipAnimations.push(animation)
			return animation
		}
	})
}

export function tooltipPlayback (page: Page) {
	return page.evaluate(() => ({
		count: window.tooltipAnimations.length,
		playbackRate: window.tooltipAnimations.at(-1)?.playbackRate
	}))
}

// Wait for the current tooltip's animation before measuring its position, including when earlier tooltips have already been removed.
export async function settleTooltipAnimations (page: Page) {
	await page.waitForFunction(() => window.tooltipAnimations.some(animation => (animation.effect as KeyframeEffect).target.isConnected))
	await page.evaluate(() => Promise.all(window.tooltipAnimations
		.filter(animation => (animation.effect as KeyframeEffect).target.isConnected)
		.map(animation => animation.finished)))
}
