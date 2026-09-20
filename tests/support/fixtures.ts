import { test as base, expect, type ConsoleMessage, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Tags required by the accessibility acceptance checklist (design/accessibility.md).
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// Collects everything the page said about itself while a test ran. Uncaught page
// errors always fail the test; console messages stay available so each suite can
// assert the checks it owns (colour-parse errors, Vue warnings, attribute warnings).
export class PageLog {
	readonly pageErrors: string[] = []
	readonly consoleMessages: { type: string, text: string }[] = []

	constructor (page: Page) {
		page.on('pageerror', error => this.pageErrors.push(error.message))
		page.on('console', (message: ConsoleMessage) => this.consoleMessages.push({ type: message.type(), text: message.text() }))
	}

	get consoleErrors () {
		return this.consoleMessages.filter(message => message.type === 'error').map(message => message.text)
	}

	get vueWarnings () {
		return this.consoleMessages.filter(message => message.type === 'warning' && message.text.includes('[Vue warn]')).map(message => message.text)
	}

	matching (pattern: RegExp) {
		return this.consoleMessages.filter(message => pattern.test(message.text)).map(message => message.text)
	}
}

// `auto` so every spec in both groups gets the runtime-error check without opting in.
export const test = base.extend<{ pageLog: PageLog }>({
	pageLog: [async ({ page }, use) => {
		const log = new PageLog(page)
		await use(log)
		expect(log.pageErrors, `unexpected page errors:\n${log.pageErrors.join('\n')}`).toEqual([])
	}, { auto: true }]
})

export { expect }

// Scoped scan: `selector` keeps the scan on the consumer under test instead of
// the whole fixture page.
export function axeScan (page: Page, selector: string) {
	return new AxeBuilder({ page }).withTags(WCAG_TAGS).include(selector).analyze()
}
