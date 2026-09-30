const { chromium, firefox } = require('@playwright/test')
async function run (name, engine) {
 let browser
 try {
  browser = await engine.launch({headless:true})
  const page=await browser.newPage()
  const results=[]
  for (const type of ['text','search','email','url','tel','password','number','date','datetime-local','month','week','time','range','color','checkbox','radio','file','button','submit','reset','image','hidden']) {
   await page.setContent(`<form novalidate><input id="entry" type="${type}" readonly aria-disabled="true"><button>Outside</button></form>`)
   const result=await page.evaluate(() => {
    const el=document.querySelector('#entry'); el.focus()
    const focused = document.activeElement === el
    el.tabIndex = 0; el.focus()
    return {requestedType: el.getAttribute('type'), type:el.type,focused,focusedWithTabindex: document.activeElement === el,readOnly:el.readOnly,value:el.value}
   })
   await page.keyboard.press('ArrowRight')
   await page.keyboard.type('x')
   const after=await page.locator('#entry').inputValue()
   results.push({...result,afterKeyboard:after})
  }
  console.log(JSON.stringify({engine:name,version:browser.version(),results},null,2))
 } catch(e) {console.log(JSON.stringify({engine:name,error:e.message}))}
 finally {await browser?.close()}
}
Promise.all([run('chromium',chromium),run('firefox',firefox)])
