import { test, expect, axeScan } from '../support/fixtures'
import type { Page, Locator } from '@playwright/test'

const textbox = '#single-control'
const group = '#embedded-control'

// Several calendars share the page on purpose: the contract has to hold for each control in each
// presentation. Scope every calendar query to the case it belongs to.
const singleCase = (page: Page) => page.locator('[data-case="single"]')
const rangeCase = (page: Page) => page.locator('[data-case="range"]')
const embeddedCase = (page: Page) => page.locator('[data-case="embedded"]')
// This one carries no presets, so its clear action has no container of its own to survive it.
const embeddedRangeCase = (page: Page) => page.locator('[data-case="embedded-range"]')
const day = (scope: Locator, name: string) => scope.getByRole('button', { name, exact: true })

test.beforeEach(async ({ page }) => {
	await page.goto('/picker-contracts')
})

test('routes attributes to the control of each presentation and keeps one id', async ({ page, pageLog }) => {
	const single = page.locator(textbox)
	await expect(single).toHaveAccessibleName('Delivery date')
	await expect(single).toHaveAttribute('name', 'booking')
	await expect(single).toHaveAttribute('maxlength', '20')
	await expect(single).toHaveAttribute('autocomplete', 'off')
	await expect(single).toHaveAttribute('aria-describedby', /^extra /)
	const root = page.locator('.bunt-date-picker.original')
	await expect(root).toHaveAttribute('lang', 'en')
	await expect(root).toHaveAttribute('dir', 'ltr')
	await expect(root).not.toHaveAttribute('id')
	// The embedded calendar's named group is the control; the root and the days never repeat its id.
	const embedded = page.locator(group)
	await expect(embedded).toHaveRole('group')
	await expect(embedded).toHaveAccessibleName('Embedded date')
	expect(await page.locator('[id="single-control"]').count()).toBe(1)
	expect(await page.locator('[id="embedded-control"]').count()).toBe(1)
	expect(await embeddedCase(page).locator('.bunt-date-picker').getAttribute('id')).toBe(null)
	expect(await embedded.locator('[data-date][id]').count()).toBe(0)

	await page.getByRole('button', { name: 'Change bindings' }).click()
	await expect(single).toHaveAttribute('maxlength', '8')
	await expect(single).toHaveAttribute('name', 'changed')
	await expect(single).toHaveAttribute('aria-describedby', /^extra second /)
	await expect(page.locator('.bunt-date-picker.alternate')).toHaveAttribute('dir', 'rtl')
	await page.getByRole('button', { name: 'Change name' }).click()
	await expect(single).toHaveAccessibleName('Caller name')
	await page.getByRole('button', { name: 'Change name' }).click()
	await expect(single).toHaveAccessibleName('Second description')
	expect(pageLog.vueWarnings).toEqual([])
})

test('forwards native listeners once and commits emit no native input or change', async ({ page }) => {
	await page.locator(textbox).click()
	let events = JSON.parse(await page.getByTestId('events').textContent())
	expect(events.filter(value => value.startsWith('single-click:'))).toEqual(['single-click:true:input'])
	await page.getByRole('button', { name: 'Clear events' }).click()
	// A calendar or preset commit updates the model without fabricating native input or change events.
	await page.locator(textbox).press('Alt+ArrowDown')
	await day(singleCase(page), 'Wednesday, September 23, 2026').click()
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-23')
	await page.locator(textbox).press('Alt+ArrowDown')
	await day(singleCase(page), 'Reference date').click()
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-16')
	events = JSON.parse(await page.getByTestId('events').textContent())
	expect(events.filter(value => value.startsWith('single-input') || value.startsWith('single-change'))).toEqual([])
	// Typing still produces the real native event on the real target.
	await page.locator(textbox).press('ControlOrMeta+A')
	await page.locator(textbox).pressSequentially('2026-09-18')
	events = JSON.parse(await page.getByTestId('events').textContent())
	expect(events.filter(value => value.startsWith('single-input')).length).toBeGreaterThan(0)
	expect(events.filter(value => value.startsWith('single-input:'))[0]).toContain(':input')
})

test('text and slotted hints merge with keyboard help and preserve parse feedback', async ({ page }) => {
	const single = page.locator(textbox)
	await expect(single).toHaveAccessibleDescription(/Caller description/)
	await expect(single).toHaveAccessibleDescription(/Choose a working day/)
	await expect(single).toHaveAccessibleDescription(/Alt\+Down opens the calendar/)
	await page.getByRole('button', { name: 'Toggle hint slot' }).click()
	await expect(single).toHaveAccessibleDescription(/Slot guidance/)
	await expect(single).not.toHaveAccessibleDescription(/Choose a working day/)
	await page.getByRole('button', { name: 'Toggle hint slot' }).click()
	await expect(single).toHaveAccessibleDescription(/Choose a working day/)
	await expect(page.locator(group)).toHaveAccessibleDescription(/Embedded guidance/)
	// A parse failure keeps its own state while the hint stays associated.
	await single.press('ControlOrMeta+A')
	await single.pressSequentially('not a date')
	await expect(single).toHaveAttribute('aria-invalid', 'true')
	await expect(single).toHaveAccessibleDescription(/Choose a working day/)
})

test('public focus reaches each presentation without opening and boundaries survive internal movement', async ({ page }) => {
	await page.getByRole('button', { name: 'Focus single' }).click()
	const single = page.locator(textbox)
	await expect(single).toBeFocused()
	await expect(single).toHaveAttribute('aria-expanded', 'false')
	await expect(page.getByTestId('events')).toHaveText('["single-focus"]')
	// Moving inside the control, including into its popup, produces no extra pair.
	await single.press('Alt+ArrowDown')
	await expect(single).toHaveAttribute('aria-expanded', 'true')
	await day(singleCase(page), 'Previous month').focus()
	await expect(page.getByTestId('events')).toHaveText('["single-focus"]')
	await page.getByRole('button', { name: 'Outside', exact: true }).focus()
	await expect(page.getByTestId('events')).toHaveText('["single-focus","single-blur"]')
	await expect(single).toHaveAttribute('aria-expanded', 'false')

	// An enabled embedded calendar focuses the day holding its tab stop, not the group.
	await page.getByRole('button', { name: 'Focus embedded' }).click()
	await expect(page.locator(`${group} button[data-date="2026-09-16"]`)).toBeFocused()
	// A disabled one has only its named group.
	await page.getByRole('button', { name: 'Focus disabled embedded' }).click()
	await expect(page.locator('#disabled-embedded-control')).toBeFocused()
	await expect(page.locator('#disabled-embedded-control')).toHaveAttribute('tabindex', '0')
})

test('caller tabindex moves the embedded tab stop without giving every day one', async ({ page }) => {
	const days = page.locator(`${group} button[data-date]`)
	await expect(page.locator(group)).toHaveAttribute('tabindex', '-1')
	expect(await days.evaluateAll(nodes => nodes.filter(node => node.tabIndex === 0).length)).toBe(1)
	await page.getByRole('button', { name: 'Toggle tabindex' }).click()
	await expect(page.locator(group)).toHaveAttribute('tabindex', '-1')
	expect(await days.evaluateAll(nodes => nodes.filter(node => node.tabIndex === 0).length)).toBe(0)
	// Programmatic focus and calendar navigation stay available.
	await page.getByRole('button', { name: 'Focus embedded' }).click()
	await expect(page.locator(`${group} button[data-date="2026-09-16"]`)).toBeFocused()
	await page.keyboard.press('ArrowRight')
	await expect(page.locator(`${group} button[data-date="2026-09-17"]`)).toBeFocused()
	await expect(page.getByTestId('embedded-value')).toHaveText('2026-09-16')
})

test('a picker nobody has touched is not styled as focused', async ({ page }) => {
	// The focused class drives the raised label and the accent outline. Every other focus case
	// asserts the focused state, so only this one catches a control that is born focused.
	await expect(singleCase(page).locator('.bunt-date-picker')).not.toHaveClass(/focused/)
	await expect(rangeCase(page).locator('.bunt-date-range-picker')).not.toHaveClass(/focused/)
	await expect(embeddedCase(page).locator('.bunt-date-picker')).not.toHaveClass(/focused/)
	await page.getByRole('button', { name: 'Focus single' }).click()
	await expect(singleCase(page).locator('.bunt-date-picker')).toHaveClass(/focused/)
	await page.getByRole('button', { name: 'Outside', exact: true }).focus()
	await expect(singleCase(page).locator('.bunt-date-picker')).not.toHaveClass(/focused/)
})

test('a caller tabindex leaves a popup calendar its own tab stop', async ({ page }) => {
	await page.getByRole('button', { name: 'Toggle tabindex' }).click()
	await page.locator(textbox).press('Alt+ArrowDown')
	// The caller's tabindex belongs to the textbox. A popup dialog's roving day stop is the
	// component's, so suppressing it would make Tab skip the whole grid.
	const days = singleCase(page).locator('button[data-date]')
	expect(await days.evaluateAll(nodes => nodes.filter(node => node.tabIndex === 0).length)).toBe(1)
})

test('a focused clear action removed together with its container still hands focus back', async ({ page }) => {
	const clear = embeddedRangeCase(page).getByRole('button', { name: 'Clear', exact: true })
	await clear.focus()
	await expect(clear).toBeFocused()
	await page.getByRole('button', { name: 'Toggle readonly' }).click()
	await expect(clear).toHaveCount(0)
	const active = embeddedRangeCase(page).locator(':focus')
	await expect(active).toHaveCount(1)
})

test('a caller tabindex leaves the popup textbox reachable through public focus and exposes the root', async ({ page }) => {
	await expect(page.getByTestId('exposed-root')).toHaveText('true')
	await page.getByRole('button', { name: 'Toggle tabindex' }).click()
	const single = page.locator(textbox)
	await expect(single).toHaveAttribute('tabindex', '-1')
	await page.getByRole('button', { name: 'Focus single' }).click()
	await expect(single).toBeFocused()
})

test('state changes that remove a focused clear action never steal focus from outside', async ({ page }) => {
	const clear = singleCase(page).getByRole('button', { name: 'Clear', exact: true })
	await clear.focus()
	await page.getByRole('button', { name: 'Toggle disabled' }).click()
	await expect(clear).toHaveCount(0)
	await expect(page.locator(textbox)).toBeFocused()
	await page.getByRole('button', { name: 'Toggle disabled' }).click()
	// With focus outside, the same change leaves it there.
	const outside = page.getByRole('button', { name: 'Outside', exact: true })
	await outside.focus()
	await page.getByRole('button', { name: 'Toggle disabled' }).click()
	await expect(outside).toBeFocused()
	await expect(clear).toHaveCount(0)
})

test('hidden and inert ancestors end the boundary and unmounting stays silent', async ({ page }) => {
	await page.getByRole('button', { name: 'Focus single' }).click()
	await expect(page.getByTestId('events')).toHaveText('["single-focus"]')
	await page.getByRole('button', { name: 'Toggle hidden' }).click()
	await expect(page.getByTestId('events')).toHaveText('["single-focus","single-blur"]')
	await page.getByRole('button', { name: 'Toggle hidden' }).click()
	await page.getByRole('button', { name: 'Focus single' }).click()
	await page.getByRole('button', { name: 'Toggle inert' }).click()
	await expect(page.getByTestId('events')).toHaveText('["single-focus","single-blur","single-focus","single-blur"]')
	await page.getByRole('button', { name: 'Toggle inert' }).click()
	await page.getByRole('button', { name: 'Focus single' }).click()
	await page.getByRole('button', { name: 'Toggle mounted' }).click()
	await expect(page.locator(textbox)).toHaveCount(0)
	await expect(page.getByTestId('events')).toHaveText('["single-focus","single-blur","single-focus","single-blur","single-focus"]')
})

test('an outside click that closes the popup leaves focus outside and reports the departure', async ({ page }) => {
	const single = page.locator(textbox)
	await single.press('Alt+ArrowDown')
	await day(singleCase(page), 'Wednesday, September 16, 2026').focus()
	await expect(page.getByTestId('events')).toHaveText('["single-focus"]')
	// A non-focusable target: focus has nowhere to go, and the picker must not take it back.
	await page.locator('h1').click()
	await expect(single).toHaveAttribute('aria-expanded', 'false')
	await expect(single).not.toBeFocused()
	await expect(page.getByTestId('events')).toHaveText('["single-focus","single-blur"]')

	await page.locator('#range-control').press('Alt+ArrowDown')
	await day(rangeCase(page), 'Wednesday, September 16, 2026').focus()
	await page.locator('h1').click()
	await expect(page.locator('#range-control')).not.toBeFocused()
	const events = JSON.parse(await page.getByTestId('events').textContent())
	expect(events.filter(value => value.startsWith('range-'))).toEqual(['range-focus', 'range-blur'])
})

for (const state of ['readonly', 'disabled']) {
	test(`${state} blocks paste, drop and late composition on the picker textbox`, async ({ page }) => {
		await page.getByRole('button', { name: `Toggle ${state}`, exact: true }).click()
		const single = page.locator(textbox)
		await single.focus()
		await page.keyboard.insertText('1999-01-01')
		await expect(single).toHaveValue('2026-09-16')
		const cancelled = await single.evaluate(el => ['paste', 'drop', 'beforeinput'].map(type => !el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }))))
		expect(cancelled).toEqual([true, true, true])
		await single.evaluate(el => {
			el.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
			;(el as HTMLInputElement).value = '1999-01-01'
			el.dispatchEvent(new InputEvent('input', { bubbles: true, data: '1999-01-01', isComposing: true }))
			el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }))
		})
		await expect(page.getByTestId('single-value')).toHaveText('2026-09-16')
		await expect(page.getByTestId('single-updates')).toHaveText('0')
	})
}

test('readonly permits inspection but blocks every value change', async ({ page }) => {
	await page.getByRole('button', { name: 'Toggle readonly' }).click()
	const single = page.locator(textbox)
	await expect(single).toHaveAttribute('aria-readonly', 'true')
	await expect(single).not.toHaveAttribute('aria-disabled', 'true')
	await single.focus()
	await expect(single).toBeFocused()
	await single.press('5')
	await single.press('ArrowUp')
	await expect(single).toHaveValue('2026-09-16')
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-16')
	// Opening and navigating remain available.
	await single.press('Alt+ArrowDown')
	await expect(single).toHaveAttribute('aria-expanded', 'true')
	await day(singleCase(page), 'Previous month').click()
	await expect(singleCase(page).locator('.month-label')).toHaveText('August 2026')
	await day(singleCase(page), 'Next month').click()
	await day(singleCase(page), 'Wednesday, September 23, 2026').click()
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-16')
	await day(singleCase(page), 'Reference date').click({ force: true })
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-16')
	await expect(singleCase(page).getByRole('button', { name: 'Clear' })).toHaveCount(0)
	// Partial range selection cannot commit either.
	await page.locator('#range-control').press('Alt+ArrowDown')
	await day(rangeCase(page), 'Monday, September 21, 2026').click()
	await day(rangeCase(page), 'Friday, September 25, 2026').click()
	await expect(page.getByTestId('range-value')).toHaveText('2026-09-16 / 2026-09-20')
	// The embedded grid exposes the state and the application can still update the model.
	await expect(page.locator(`${group} [role="grid"]`).first()).toHaveAttribute('aria-readonly', 'true')
	await page.getByRole('button', { name: 'Update models' }).click()
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-25')
})

test('disabled keeps one focus target, blocks operation and preserves drafts', async ({ page }) => {
	const single = page.locator(textbox)
	await single.press('ControlOrMeta+A')
	await single.pressSequentially('2026-09-1')
	await expect(single).toHaveValue('2026-09-1')
	await page.getByRole('button', { name: 'Toggle disabled' }).click()
	await expect(single).toBeFocused()
	await expect(single).toHaveAttribute('aria-disabled', 'true')
	await expect(single).toHaveValue('2026-09-1')
	await single.press('Alt+ArrowDown')
	await expect(single).toHaveAttribute('aria-expanded', 'false')
	await single.press('5')
	await expect(single).toHaveValue('2026-09-1')
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-16')
	// Enter cannot submit from a disabled textbox, but an enabled field in the same form still does.
	await single.press('Enter')
	await expect(page.getByTestId('submits')).toHaveText('0')
	await page.locator('#plain-control').press('Enter')
	await expect(page.getByTestId('submits')).toHaveText('1')
	// The embedded calendar exposes its state and keeps its internal controls out of Tab order.
	await expect(page.locator(group)).toHaveAttribute('aria-disabled', 'true')
	expect(await page.locator(`${group} button`).evaluateAll(nodes => nodes.every(node => (node as HTMLButtonElement).disabled))).toBe(true)
	// Re-enabling keeps the draft and emits no model update.
	await page.getByRole('button', { name: 'Toggle disabled' }).click()
	await expect(single).toHaveValue('2026-09-1')
	await expect(page.getByTestId('single-value')).toHaveText('2026-09-16')
})

test('disabling an open picker closes it without committing and returns focus', async ({ page }) => {
	const range = page.locator('#range-control')
	await range.press('Alt+ArrowDown')
	await day(rangeCase(page), 'Monday, September 21, 2026').click()
	await expect(range).toHaveAttribute('aria-expanded', 'true')
	// Reaching a control outside the picker would dismiss it first, so the application drives this.
	await page.evaluate(() => window.dispatchEvent(new Event('disable-pickers')))
	await expect(range).toHaveAttribute('aria-expanded', 'false')
	await expect(range).toBeFocused()
	await expect(page.getByTestId('range-value')).toHaveText('2026-09-16 / 2026-09-20')
	// Re-enabling neither reopens the popup nor resumes the cancelled selection.
	await page.getByRole('button', { name: 'Toggle disabled' }).click()
	await expect(range).toHaveAttribute('aria-expanded', 'false')
	await expect(page.getByTestId('range-value')).toHaveText('2026-09-16 / 2026-09-20')
})

test('clearing follows the live token, the editable model and exact update semantics', async ({ page }) => {
	const clear = singleCase(page).getByRole('button', { name: 'Clear', exact: true })
	await expect(clear).toHaveCount(1)
	const suppression = page.getByTestId('suppression')
	// A declaration on an ancestor hides the action, including while the popup is open.
	await page.locator(textbox).press('Alt+ArrowDown')
	await suppression.selectOption('ancestor')
	await expect(clear).toBeHidden()
	await suppression.selectOption('direct')
	await expect(clear).toBeHidden()
	// Unsupported and empty values resolve back to auto.
	await suppression.selectOption('invalid')
	await expect(clear).toBeVisible()
	await suppression.selectOption('empty')
	await expect(clear).toBeVisible()
	await suppression.selectOption('auto')
	await page.locator(textbox).press('Escape')

	// Readonly and disabled remove it regardless of CSS.
	await page.getByRole('button', { name: 'Toggle readonly' }).click()
	await expect(clear).toHaveCount(0)
	await page.getByRole('button', { name: 'Toggle readonly' }).click()
	await expect(clear).toHaveCount(1)

	// The embedded action obeys the same inherited token.
	const embeddedClear = embeddedCase(page).getByRole('button', { name: 'Clear', exact: true })
	await suppression.selectOption('ancestor')
	await expect(embeddedClear).toBeHidden()
	await suppression.selectOption('auto')
	await expect(embeddedClear).toBeVisible()

	// Exactly one model update, draft discarded, popup closed and focus back on the textbox.
	await page.locator(textbox).press('ControlOrMeta+A')
	await page.locator(textbox).pressSequentially('2026-09-1')
	const updatesBefore = Number(await page.getByTestId('single-updates').textContent())
	await clear.click()
	await expect(page.getByTestId('single-updates')).toHaveText(String(updatesBefore + 1))
	await expect(page.getByTestId('single-value')).toHaveText('empty')
	await expect(page.locator(textbox)).toHaveValue('')
	await expect(page.locator(textbox)).toBeFocused()
	await expect(clear).toHaveCount(0)
	// An empty model does not expose the action; a range needs only one endpoint.
	const rangeClear = rangeCase(page).getByRole('button', { name: 'Clear', exact: true })
	await expect(rangeClear).toHaveCount(1)
	await rangeClear.click()
	await expect(page.getByTestId('range-value')).toHaveText('empty / empty')
	await expect(rangeClear).toHaveCount(0)
})

test('a focused clear action that CSS hides hands focus back to the textbox', async ({ page }) => {
	const clear = singleCase(page).getByRole('button', { name: 'Clear', exact: true })
	await clear.focus()
	await expect(clear).toBeFocused()
	await page.getByTestId('suppression').selectOption('ancestor')
	await expect(page.locator(textbox)).toBeFocused()
	const events = JSON.parse(await page.getByTestId('events').textContent())
	expect(events.filter(value => value === 'single-blur')).toEqual([])
})

test('embedded clearing stays mounted and moves focus into the calendar', async ({ page }) => {
	const embeddedClear = embeddedCase(page).getByRole('button', { name: 'Clear', exact: true })
	await expect(page.getByTestId('embedded-value')).toHaveText('2026-09-16')
	await embeddedClear.focus()
	await embeddedClear.press('Enter')
	await expect(page.getByTestId('embedded-value')).toHaveText('empty')
	await expect(page.locator(group)).toBeVisible()
	await expect(page.locator(group).locator(':focus')).toHaveCount(1)
	await expect(embeddedClear).toHaveCount(0)
})

test('pickers carry no control-level tooltip while day reasons still explain themselves', async ({ page }) => {
	await expect(page.locator('[data-bunt-entry]')).toHaveCount(0)
	await expect(page.locator('.bunt-tooltip')).toHaveCount(0)
	await expect(page.locator(textbox)).toHaveAccessibleDescription(/Choose a working day/)
	// The disabled-day reason is an inline directive consumer on the day itself.
	await page.locator(textbox).press('Alt+ArrowDown')
	await day(singleCase(page), 'Saturday, September 19, 2026').hover()
	await expect(page.locator('.bunt-tooltip')).toHaveText('Weekends are closed')
	await expect(page.locator(textbox)).toHaveAccessibleDescription(/Choose a working day/)
	expect(await page.locator(textbox).getAttribute('aria-describedby')).not.toContain('tooltip')
})

test('accessibility scan and meaningful state snapshot', async ({ page }) => {
	const results = await axeScan(page, '.c-picker-contracts')
	// One scoped exception, pending an owner decision recorded in TODOs.md: `.today` paints the
	// current day in --clr-primary, which is 3.12:1 against the light surface. That rule predates
	// this package and recolouring the marker is a visual decision. Drop the filter once it is settled.
	const unexpected = results.violations.filter(violation => !(violation.id === 'color-contrast'
		&& violation.nodes.every(node => String(node.target).includes('.today'))))
	expect(unexpected).toEqual([])
	// Playwright's snapshot syntax rejects tab indentation, so this literal uses spaces.
	await expect(page.locator('#disabled-embedded-control')).toMatchAriaSnapshot(`
    - group "Unavailable date":
      - button "Previous month" [disabled]
      - button "Next month" [disabled]
      - grid:
        - row:
          - gridcell "Wednesday, September 16, 2026" [selected]:
            - button "Wednesday, September 16, 2026" [disabled]
  `)
	// The editable embedded calendar exposes readonly on its grid rather than on the group.
	await page.getByRole('button', { name: 'Toggle readonly' }).click()
	await expect(page.locator(`${group} [role="grid"]`).first()).toHaveAttribute('aria-readonly', 'true')
	await expect(page.locator(group)).not.toHaveAttribute('aria-readonly')
})

test('server rendered pickers keep their ids through hydration', async ({ page, request, pageLog }) => {
	const response = await request.get('/ssr-pickers?ssr')
	expect(response.ok()).toBeTruthy()
	const html = await response.text()
	expect(html).not.toContain('NaN')
	const serverIds = [...html.matchAll(/\bid="(bunt-[^"]+)"/g)].map(match => match[1])
	expect(serverIds.length).toBeGreaterThanOrEqual(5)
	expect(new Set(serverIds).size).toBe(serverIds.length)
	await page.goto('/ssr-pickers?ssr')
	await expect(page.getByRole('combobox', { name: 'First date' })).toHaveValue('2026-09-16')
	const clientIds = await page.locator('[id^="bunt-"]').evaluateAll(nodes => nodes.map(node => node.id))
	expect(clientIds).toEqual(serverIds)
	expect(pageLog.matching(/hydration|mismatch/i)).toEqual([])
	await expect(page.getByRole('combobox', { name: 'First date' })).toHaveAccessibleDescription(/First hint/)
	await expect(page.getByRole('group', { name: 'Fourth date' })).toHaveAccessibleDescription(/Fourth hint/)
})

test('the new caption, hint and group focus states stay visible in both surfaces', async ({ page }) => {
	for (const scheme of ['light', 'dark'] as const) {
		await page.emulateMedia({ colorScheme: scheme })
		await expect(embeddedCase(page).locator('.calendar-caption')).toBeVisible()
		await expect(embeddedCase(page).locator('.hint')).toBeVisible()
		const caption = await embeddedCase(page).locator('.calendar-caption').evaluate(node => getComputedStyle(node).color)
		const surface = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
		expect(caption).not.toBe(surface)
	}
	await page.emulateMedia({ colorScheme: 'light' })
})

test('compact size hides the hint in both presentations, as it does for input', async ({ page }) => {
	await page.getByRole('button', { name: 'Toggle compact' }).click()
	const compact = page.locator('[data-case="compact"]')
	await expect(compact.locator('.bunt-input--size-compact')).toHaveCount(3) // setup evidence only
	for (const guidance of ['Compact popup guidance', 'Compact inline guidance', 'Compact range guidance']) {
		await expect(compact.getByText(guidance)).toBeHidden()
	}
	await expect(embeddedCase(page).locator('.hint')).toBeVisible()
})

test('the named group draws a focus ring when the keyboard reaches it', async ({ page }) => {
	const group = page.locator('#disabled-embedded-control')
	await page.getByRole('button', { name: 'Outside', exact: true }).focus()
	await page.keyboard.press('Shift+Tab')
	await expect(group).toBeFocused()
	expect(await group.evaluate(node => node.matches(':focus-visible'))).toBe(true)
	// outlineWidth alone reports the initial `medium` whatever the style, so read both.
	const ring = await group.evaluate(node => [getComputedStyle(node).outlineStyle, getComputedStyle(node).outlineWidth])
	expect(ring[0]).not.toBe('none')
	expect(ring[1]).not.toBe('0px')
})

test.describe('forced colours', () => {
	test.use({ forcedColors: 'active' })

	test('the new picker surfaces keep the system palette', async ({ page }) => {
		expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true) // setup evidence only
		for (const selector of ['.calendar-caption', '.hint']) {
			const node = embeddedCase(page).locator(selector)
			await expect(node).toBeVisible()
			expect(await node.evaluate(el => getComputedStyle(el).getPropertyValue('forced-color-adjust'))).not.toBe('none')
		}
		const group = page.locator('#embedded-control')
		expect(await group.evaluate(el => getComputedStyle(el).getPropertyValue('forced-color-adjust'))).not.toBe('none')
	})
})
