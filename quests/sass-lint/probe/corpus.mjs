// Declarations each parser finds in a real corpus, then stylelint + postcss-sass over it.
// usage: node corpus.mjs <repo root>
import fs from 'node:fs'
import path from 'node:path'
import postcssSass from 'postcss-sass'
import postcssHtml from 'postcss-html'
import * as sassParser from 'sass-parser'
import stylelint from 'stylelint'

const root = process.argv[2]
const files = fs.globSync('src/**/*.{sass,vue}', { cwd: root }).filter(f => f.endsWith('.sass') || fs.readFileSync(path.join(root, f), 'utf8').includes('lang="sass"'))
const rules = {
	'color-no-hex': true,
	'color-named': 'never',
	'color-no-invalid-hex': true,
	'property-no-unknown': true,
	'declaration-block-no-duplicate-properties': true,
}
function count (root) { let decls = 0, rules = 0, atrules = 0; root.walk(n => { if (n.type === 'decl') decls++; else if (n.type === 'rule') rules++; else if (n.type === 'atrule') atrules++ }); return { decls, rules, atrules } }
for (const f of files) {
	const src = fs.readFileSync(path.join(root, f), 'utf8')
	if (f.endsWith('.vue')) {
		const r = await stylelint.lint({ files: [path.join(root, f)], config: { rules, customSyntax: postcssHtml({ sass: postcssSass }) } }).catch(e => ({ err: e.message.split('\n')[0] }))
		console.log(`${f}  [vue] stylelint+postcss-sass: ${r.err ? 'THREW ' + r.err : r.results[0].warnings.map(w => `L${w.line} ${w.rule}`).join(', ') || 'no warnings'}`)
		continue
	}
	let a, b
	try { a = count(sassParser.sass.parse(src)) } catch (e) { a = 'FAIL ' + e.message.split('\n')[0] }
	try { b = count(postcssSass.parse(src)) } catch (e) { b = 'FAIL ' + e.message.split('\n')[0].slice(0, 70) }
	const r = await stylelint.lint({ files: [path.join(root, f)], config: { rules, customSyntax: postcssSass } }).catch(e => ({ err: e.message.split('\n')[0] }))
	const lint = r.err ? 'THREW ' + r.err : r.results[0].warnings.map(w => `L${w.line} ${w.rule}`).join(', ') || 'no warnings'
	console.log(`${f}  lines=${src.split('\n').length}\n  sass-parser  ${JSON.stringify(a)}\n  postcss-sass ${JSON.stringify(b)}\n  stylelint+postcss-sass: ${lint}`)
}
