import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import vue from 'eslint-plugin-vue'
import vuePug from 'eslint-plugin-vue-pug'

const ignores = globalIgnores([
	'**/node_modules',
	'dist',
	'docs/.vitepress/cache',
	'docs/.vitepress/.temp',
	'docs/.vitepress/dist',
	// quest records: markdown plus throwaway probe/prototype scripts, not library code
	'quests',
	// playwright output (gitignored; regenerated per run)
	'playwright-report',
	'playwright-report-docs',
	'test-results',
	'test-results-docs'
])

export default defineConfig([
	ignores,
	...ts.config(
		js.configs.recommended,
		ts.configs.recommended
	),
	stylistic.configs.customize({
		indent: 'tab',
		braceStyle: '1tbs',
		quoteProps: 'as-needed'
	}),
	...vue.configs['flat/recommended'],
	...vuePug.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				localStorage: false,
				$: 'readonly',
				$$: 'readonly',
				$ref: 'readonly',
				$computed: 'readonly',
			},
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},

		rules: {
			'no-debugger': 'off',
			curly: 0,
			'no-return-assign': 0,
			'no-console': 'off',
			'vue/require-default-prop': 0,
			'vue/require-v-for-key': 0,
			'vue/valid-v-for': 'warn',
			'vue/no-reserved-keys': 0,
			'vue/no-setup-props-destructure': 0,
			'vue/multi-word-component-names': 0,
			'vue/max-attributes-per-line': 0,
			'vue/html-indent': ['warn', 'tab'],
			'vue/attribute-hyphenation': ['warn', 'never'],
			'vue/v-on-event-hyphenation': ['warn', 'never'],
			'import/first': 0,
			'@typescript-eslint/ban-ts-comment': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'no-use-before-define': 'off',

			// same-scope TDZ only: components routinely read $ref/$computed bindings
			// and classes from handlers declared above them, which runs later
			'@typescript-eslint/no-use-before-define': ['error', {
				typedefs: false,
				functions: false,
				classes: false,
				variables: false,
			}],

			'@typescript-eslint/no-unused-vars': ['error', {
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true
			}],

			'@stylistic/comma-dangle': 0,
			'@stylistic/space-before-function-paren': ['error', 'always'],
			'@stylistic/max-statements-per-line': ['error', { max: 1, ignoredNodes: ['BreakStatement'] }],
			'@stylistic/member-delimiter-style': 0,
			'@stylistic/arrow-parens': 0,
			'@stylistic/generator-star-spacing': 0,
			'@stylistic/yield-star-spacing': ['error', 'after'],
		},
	},
	{
		// the v2 stylus mixin entry point, kept for consumers still on v2
		files: ['stylus.js'],
		languageOptions: { sourceType: 'commonjs' },
		rules: { '@typescript-eslint/no-require-imports': 0 }
	}
])
