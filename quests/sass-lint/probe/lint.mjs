// stylelint on the fixtures with a few semantic rules, once per parser.
import stylelint from 'stylelint'
import postcssSass from 'postcss-sass'
import postcssHtml from 'postcss-html'
import * as sassParser from 'sass-parser'

const rules = {
	'color-no-hex': true,
	'color-named': 'never',
	'color-no-invalid-hex': true,
	'property-no-unknown': true,
	'declaration-block-no-duplicate-properties': true,
}
// sass-parser's syntax methods need their `this`
const sassParserSyntax = { parse: (css, opts) => sassParser.sass.parse(css, opts), stringify: (...a) => sassParser.sass.stringify(...a) }
const syntaxes = { 'postcss-sass': postcssSass, 'sass-parser': sassParserSyntax }
for (const file of ['fixtures/probe.sass', 'fixtures/Probe.vue']) {
	for (const [name, syntax] of Object.entries(syntaxes)) {
		const customSyntax = file.endsWith('.vue') ? postcssHtml({ sass: syntax }) : syntax
		try {
			const { results: [res] } = await stylelint.lint({ files: [file], config: { rules, customSyntax } })
			console.log(`${file} / ${name}: ${res.warnings.length} warnings`)
			for (const w of res.warnings) console.log(`  L${w.line}:${w.column} ${w.text}`)
		} catch (e) {
			console.log(`${file} / ${name}: THREW ${e.message.split('\n')[0]} (${e.stack.split('\n')[1].trim().replace(/\(.*node_modules\//, '(')})`)
		}
	}
}
