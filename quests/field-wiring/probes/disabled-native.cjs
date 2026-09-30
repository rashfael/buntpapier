const { chromium, firefox, webkit } = require('@playwright/test')
async function probe(name, engine) {
	let browser
	try {
		browser = await engine.launch({ headless: true, timeout: 12000 })
		const page = await browser.newPage()
		await page.setContent(`<form id="f"><label id="label" for="c">Setting</label><input id="c" type="checkbox" required aria-disabled="true"><button type="submit">Submit</button></form><input id="t" value="existing" readonly aria-disabled="true">`)
		await page.evaluate(() => {
			window.events = { input: 0, change: 0, submit: 0, invalid: 0 }
			const c = document.querySelector('#c')
			c.addEventListener('click', e => e.preventDefault())
			for (const type of ['input', 'change', 'invalid']) c.addEventListener(type, () => window.events[type]++)
			document.querySelector('#f').addEventListener('submit', e => { e.preventDefault(); window.events.submit++ })
		})
		const activations = []
		for (const action of ['pointer', 'label', 'space', 'script-click']) {
			if (action === 'pointer' || action === 'label') {
				const box = await page.locator(action === 'pointer' ? '#c' : '#label').boundingBox()
				await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
			} else if (action === 'space') { await page.focus('#c'); await page.keyboard.press('Space') }
			else await page.evaluate(() => document.querySelector('#c').click())
			activations.push({ action, ...await page.evaluate(() => ({ checked: document.querySelector('#c').checked, events: { ...window.events } })) })
		}
		await page.focus('#t')
		await page.keyboard.type('replacement')
		const text = await page.inputValue('#t')
		const submit = []
		for (const mode of ['aria-disabled-required', 'native-disabled', 'noValidate', 'required-suppressed']) {
			const result = await page.evaluate(mode => {
				const f = document.querySelector('#f'), c = document.querySelector('#c')
				c.disabled = mode === 'native-disabled'
				c.required = mode !== 'required-suppressed'
				f.noValidate = mode === 'noValidate'
				window.events.submit = 0; window.events.invalid = 0
				f.requestSubmit()
				return { willValidate: c.willValidate, valid: c.validity.valid, ...window.events }
			}, mode)
			submit.push({ mode, ...result })
		}
		console.log(JSON.stringify({ engine: name, version: browser.version(), activations, readonlyText: text, submit }))
	} catch (error) { console.log(JSON.stringify({ engine: name, unavailable: error.message.split('\n').slice(0, 4).join('\n') })) }
	finally { if (browser) await browser.close() }
}
Promise.all([probe('chromium', chromium), probe('firefox', firefox), probe('webkit', webkit)])
