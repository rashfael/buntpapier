// Runs observe-test.html in one or all Playwright engines and prints one line per case.
// Usage: node quests/style-observer/prototype/run.mjs [chromium|firefox|webkit]
// Needs the project's playwright install; set PLAYWRIGHT_BROWSERS_PATH if the browsers live elsewhere.
import { createRequire } from 'node:module'

const require = createRequire(new URL('../../../package.json', import.meta.url))
const { chromium, firefox, webkit } = require('playwright')
const url = new URL('observe-test.html', import.meta.url).href
const only = process.argv[2]

for (const [name, type] of Object.entries({ chromium, firefox, webkit })) {
	if (only && only !== name) continue
	let browser
	try {
		browser = await type.launch()
	} catch (e) {
		console.log(`## ${name}: launch failed: ${e.message.split('\n')[0]}`)
		continue
	}
	const page = await browser.newPage()
	page.on('pageerror', e => console.log(`[${name}] pageerror ${e.message}`))
	await page.goto(url)
	const { supports, results } = await page.evaluate(() => runAll())
	console.log(`## ${name} ${browser.version()}  allow-discrete supported: ${supports}`)
	for (const r of results) {
		if (r.error) {
			console.log(`  ${r.name}: ERROR ${r.error}`)
			continue
		}
		console.log(`  ${r.fired ? 'FIRED ' : 'silent'} x${r.starts}  ${r.name}\n         first: ${r.firstStart} | before=${r.before} afterSync=${r.afterSync} after=${r.after} | events=${r.eventTypes || '-'}`)
	}
	await browser.close()
}
