// Compatibility checks intentionally fail against the unrepaired rewrite.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const variant = process.argv[2] || 'baseline'
const results = JSON.parse(fs.readFileSync(process.argv[3] || path.join(__dirname, 'results.json'), 'utf8'))
let failures = 0
let checks = 0
for (const engine of ['chromium', 'firefox']) {
	function check (name, verify) {
		checks++
		try {
			const result = results.find(r => r.engine === engine && r.variant === variant && r.name === name)
			assert.ok(result, `Missing ${name}`)
			assert.equal(result.failure, undefined)
			assert.deepEqual(result.errors, [])
			verify(result)
			console.log(`PASS ${engine} ${variant} ${name}`)
		} catch (error) {
			failures++
			console.error(`FAIL ${engine} ${variant} ${name}: ${error.message}`)
		}
	}
	check('hover-animation', r => {
		assert.equal(r.animations.length, 1, 'Opening animation must remain present')
		assert.equal(r.animations[0][1].duration, 200)
		assert.equal(r.animations[0][0][0].opacity, 0)
		assert.equal(r.animations[0][0][1].opacity, 1)
	})
	for (const name of ['click-through-tooltip', 'click-invisible-halo']) check(name, r => {
		assert.equal(r.counts.behindClicks, 1, 'Pointer activation must reach the underlying control')
		assert.equal(r.counts.clicks, 0, 'Tooltip must not activate its owning button')
		assert.equal(r.counts.submits, 0, 'Tooltip must not submit its owning form')
	})
	check('ordinary-tooltip-click', r => {
		assert.equal(r.counts.clicks, 0)
		assert.equal(r.counts.submits, 0)
		assert.notEqual(r.focus, 'trigger', 'Tooltip pixels must not focus the owning button')
	})
	check('click-trigger-then-leave', r => assert.equal(r.tooltipCount, 0, 'Mouse activation must not pin the explanation open'))
}
console.log(`${checks - failures}/${checks} compatibility checks passed for ${variant}`)
process.exitCode = failures ? 1 : 0
