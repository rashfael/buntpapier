// Which indented-Sass constructs each parser keeps, and what it prints back.
// The Sass compiler is the reference for what is valid.
import * as sass from 'sass'
import postcssSass from 'postcss-sass'
import * as sassParser from 'sass-parser'

const constructs = {
	'@layer block': '@layer x\n\t.a\n\t\tcolor: red\n',
	'@layer statement': '@layer a, b\n.a\n\tcolor: red\n',
	'@use': '@use "sass:math"\n.a\n\twidth: math.div(4px, 2)\n',
	'@forward': '@forward "sass:math"\n',
	'@each over map': '@each $k, $v in (a: 1, b: 2)\n\t.i-#{$k}\n\t\tz-index: $v\n',
	'@function': '@function dbl($n)\n\t@return $n * 2\n.a\n\twidth: dbl(2px)\n',
	'@container': '.a\n\t@container (min-width: 400px)\n\t\tcolor: red\n',
	'@keyframes from/to': '@keyframes spin\n\tto\n\t\ttransform: rotate(1turn)\n',
	'@keyframes percentage': '@keyframes spin\n\t100%\n\t\ttransform: rotate(1turn)\n',
	'%placeholder + @extend': '%p\n\tcolor: red\n.a\n\t@extend %p\n',
	'=mixin / +include': '=m($c)\n\tcolor: $c\n.a\n\t+m(red)\n',
	'nested properties': '.a\n\tfont:\n\t\tfamily: x\n',
	'empty rule': '.a\n\tcolor: red\n\n.b\n',
}
function decls (root) { let n = 0; root.walkDecls(() => n++); return n }
for (const [label, src] of Object.entries(constructs)) {
	const expected = (() => { try { sass.compileString(src, { syntax: 'indented' }); return 'valid' } catch (e) { return 'INVALID ' + e.message.split('\n')[0] } })()
	const run = parse => { try { const r = parse(src); return `decls=${decls(r)} prints=${JSON.stringify(r.toString()).slice(0, 60)}` } catch (e) { return 'FAIL ' + e.message.split('\n')[0].slice(0, 70) } }
	console.log(`[${label}] compiler: ${expected}`)
	console.log(`  sass-parser  ${run(s => sassParser.sass.parse(s))}`)
	console.log(`  postcss-sass ${run(s => postcssSass.parse(s))}`)
}
