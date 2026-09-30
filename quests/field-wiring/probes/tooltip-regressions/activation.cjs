const { chromium, firefox } = require(require('node:path').join(process.cwd(), 'node_modules/playwright'))
const fs = require('node:fs')
async function main () {
	const results=[]
	for (const [engine,launcher] of Object.entries({chromium,firefox})) {
		const browser=await launcher.launch()
		for(const [variant,port] of [['baseline',5374],['current',5375]]) {
			const page=await browser.newPage({viewport:{width:1000,height:800}})
			page.setDefaultTimeout(15000)
			for(const target of ['trigger','native','link']) {
				await page.goto(`http://localhost:${port}/tooltip-audit`)
				await page.locator(`#${target}`).hover()
				await page.waitForTimeout(300)
				const b=await page.locator('.bunt-tooltip').boundingBox()
				const x=b.x+b.width/2,y=b.y+b.height/2
				const observations=[]
				for(let click=0;click<2;click++) {
					await page.mouse.move(x,y)
					await page.mouse.down()
					const active=await page.locator(`#${target}`).evaluate(el=>el.matches(':active'))
					await page.mouse.up()
					await page.waitForTimeout(100)
					observations.push(await page.evaluate(({active})=>({active,counts:JSON.parse(document.querySelector('#counts').textContent),hash:location.hash,focus:document.activeElement.id}),{active}))
				}
				await page.mouse.move(5,5);await page.waitForTimeout(450)
				results.push({engine,browserVersion:browser.version(),variant,target,observations,remaining:await page.locator('.bunt-tooltip').count()})
			}
			await page.close()
		}
		await browser.close()
	}
	fs.writeFileSync(require('node:path').join(process.env.TOOLTIP_AUDIT_DIR || '/tmp/bunt-tooltip-audit', 'activation.json'),JSON.stringify(results,null,2)+'\n')
	console.log(JSON.stringify(results,null,2))
}
main().catch(e=>{console.error(e);process.exit(1)})
