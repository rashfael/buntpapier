const { chromium, firefox } = require(require('node:path').join(process.cwd(), 'node_modules/playwright'))
const fs = require('node:fs')
async function main () {
	const results = []
	for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
		const browser = await launcher.launch({ headless: true })
		for (const [variant, port] of [['baseline', 5374], ['current', 5375]]) {
			const page = await browser.newPage({ viewport: { width: 1000, height: 800 } })
			page.setDefaultTimeout(15000)
			let errors = []
			page.on('pageerror', e => errors.push(e.message))
			await page.addInitScript(() => {
				window.events = []
				for (const type of ['pointerdown','mousedown','focusin','mouseup','click']) document.addEventListener(type, event => window.events.push({type, target: event.target.id || event.target.className}), true)
				window.animations = []
				const animate = Element.prototype.animate
				Element.prototype.animate = function (...args) {
					if (this.classList.contains('bunt-tooltip')) window.animations.push(args)
					return animate.apply(this, args)
				}
			})
			async function reset () {
				errors = []
				await page.goto(`http://localhost:${port}/tooltip-audit`)
				await page.locator('#trigger').waitFor()
				await page.evaluate(() => document.fonts.ready)
				await page.mouse.move(5, 5)
			}
			async function state () {
				return page.evaluate(() => ({
					tooltipCount: document.querySelectorAll('.bunt-tooltip').length,
					text: document.querySelector('.bunt-tooltip')?.textContent,
					focus: document.activeElement.id,
					counts: JSON.parse(document.querySelector('#counts').textContent),
					animations: window.animations,
					events: window.events,
					description: document.querySelector('#trigger')?.getAttribute('aria-describedby'),
					style: (() => {const e=document.querySelector('.bunt-tooltip'); if (!e) return null; const s=getComputedStyle(e); const r=e.getBoundingClientRect(); return {pointerEvents:s.pointerEvents,position:s.position,transform:s.transform,top:s.top,bottom:s.bottom,left:s.left,right:s.right,x:r.x,y:r.y,width:r.width,height:r.height,placement:e.getAttribute('data-popper-placement')}})()
				}))
			}
			async function sample (name, fn) {
				await reset()
				try { await fn(); results.push({engine,browserVersion:browser.version(),variant,name,...await state(),errors}) }
				catch(e) {results.push({engine,variant,name,failure:e.message,errors})}
				console.log(engine, variant, name, results.at(-1).failure || 'observed')
			}
			await sample('hover-animation', async () => { await page.locator('#trigger').hover(); await page.waitForTimeout(250) })
			await sample('hover-leave', async () => { await page.locator('#trigger').hover(); await page.waitForTimeout(250); await page.mouse.move(5,5); await page.waitForTimeout(450) })
			await sample('keyboard-focus', async () => {await page.locator('#trigger').focus(); await page.waitForTimeout(250)})
			await sample('click-trigger-then-leave', async () => {await page.locator('#trigger').click(); await page.mouse.move(5,5); await page.waitForTimeout(500)})
			for (const halo of [false,true]) await sample(halo?'click-invisible-halo':'click-through-tooltip', async () => {
				await page.evaluate(() => { window.audit.error.value='Error explanation' })
				await page.waitForTimeout(300)
				const box=await page.locator('.bunt-tooltip').boundingBox()
				const x=box.x+box.width/2, y=halo?box.y+box.height+4:box.y+box.height/2
				await page.locator('#behind').evaluate((el,{x,y})=> {Object.assign(el.style,{left:`${x-10}px`,top:`${y-10}px`,width:'20px',height:'20px'})},{x,y})
				await page.mouse.click(x,y)
				await page.mouse.move(5,5)
				await page.waitForTimeout(450)
			})
			await sample('hover-tooltip-then-leave', async () => {await page.locator('#trigger').hover(); await page.waitForTimeout(250); const b=await page.locator('.bunt-tooltip').boundingBox(); await page.mouse.move(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(450); })
			await sample('escape-hover', async () => {await page.locator('#outside').focus(); await page.locator('#trigger').hover(); await page.waitForTimeout(250); await page.keyboard.press('Escape'); await page.waitForTimeout(450)})
			await sample('forced-escape-rerender', async () => {await page.evaluate(()=>{window.audit.error.value='Error'}); await page.waitForTimeout(250); await page.keyboard.press('Escape'); await page.evaluate(()=>{window.audit.error.value='Changed error'}); await page.waitForTimeout(450)})
			await sample('text-update', async () => {await page.locator('#trigger').hover(); await page.waitForTimeout(250); await page.evaluate(()=>{window.audit.text.value='Much longer changed tooltip explanation'}); await page.waitForTimeout(250)})
			await sample('empty-then-restored-while-hovered', async () => {await page.locator('#trigger').hover(); await page.waitForTimeout(250); await page.evaluate(()=>{window.audit.text.value=''}); await page.waitForTimeout(50); await page.evaluate(()=>{window.audit.text.value='Restored'}); await page.waitForTimeout(250)})
			await sample('unmount-open', async () => {await page.locator('#trigger').hover(); await page.waitForTimeout(30); await page.evaluate(()=>{window.audit.present.value=false}); await page.waitForTimeout(450)})
			await sample('forced-off-while-hovered', async () => {await page.evaluate(()=>{window.audit.forced.value=true}); await page.waitForTimeout(250); await page.locator('#plain').hover(); await page.evaluate(()=>{window.audit.forced.value=false}); await page.waitForTimeout(450)})
			await sample('ordinary-tooltip-click', async () => {
				await page.locator('#trigger').hover(); await page.waitForTimeout(250)
				const b=await page.locator('.bunt-tooltip').boundingBox()
				await page.mouse.click(b.x+b.width/2,b.y+b.height/2)
				await page.mouse.move(5,5); await page.waitForTimeout(450)
			})
			await sample('focus-escape-blur-refocus', async () => {
				await page.locator('#trigger').focus(); await page.waitForTimeout(100); await page.keyboard.press('Escape')
				await page.locator('#outside').focus(); await page.waitForTimeout(400); await page.locator('#trigger').focus(); await page.waitForTimeout(250)
			})
			await sample('forced-escape-only', async () => {
				await page.evaluate(()=>{window.audit.error.value='Error'}); await page.waitForTimeout(250); await page.keyboard.press('Escape'); await page.waitForTimeout(450)
			})
			await sample('top-placement', async () => {
				await page.evaluate(()=>{document.querySelector('#plain').style.setProperty('--tooltip-placement','top'); window.audit.forced.value=true}); await page.waitForTimeout(250)
			})
			await sample('right-placement', async () => {
				await page.evaluate(()=>{document.querySelector('#plain').style.setProperty('--tooltip-placement','right'); window.audit.forced.value=true}); await page.waitForTimeout(250)
			})
			await sample('viewport-edge-flip', async () => {
				await page.evaluate(()=>{Object.assign(document.querySelector('#plain').style,{position:'fixed',left:'5px',top:'5px',margin:'0'}); document.querySelector('#plain').style.setProperty('--tooltip-placement','top'); window.audit.forced.value=true}); await page.waitForTimeout(250)
			})
			await sample('scroll-position', async () => {
				await page.evaluate(()=>{document.body.style.height='2000px';window.audit.forced.value=true}); await page.waitForTimeout(250); await page.evaluate(()=>window.scrollTo(0,150)); await page.waitForTimeout(250)
			})
			await sample('fixed-position', async () => {await page.evaluate(()=>{window.audit.fixed.value=true;window.audit.forced.value=true}); await page.waitForTimeout(250)})
			await sample('explicit-right-placement', async () => {await page.evaluate(()=>{document.querySelector('#plain').style.setProperty('--tooltip-placement','initial');window.audit.placement.value='right';window.audit.forced.value=true}); await page.waitForTimeout(250)})
			await page.close()
		}
		await browser.close()
	}
	fs.writeFileSync(require('node:path').join(process.env.TOOLTIP_AUDIT_DIR || '/tmp/bunt-tooltip-audit', 'results.json'),JSON.stringify(results,null,2)+'\n')
	for(const r of results) console.log(JSON.stringify({engine:r.engine,variant:r.variant,name:r.name,count:r.tooltipCount,focus:r.focus,clicks:r.counts,animations:r.animations?.length,style:r.style,errors:r.errors,failure:r.failure}))
}
main().catch(e=>{console.error(e);process.exit(1)})
