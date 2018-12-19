module.exports = {
		root: true,
		parserOptions: {
			source_type: 'module',
			parser: 'babel-eslint'
		},
		extends: [
			'standard',
			'plugin:vue/essential'
		],

		plugins: [
			'vue'
		],

		// add your custom rules here
		rules: {
			'arrow-parens': 0,
			'generator-star-spacing': 0,
			'no-debugger': 'off',
			indent: [2, 'tab', {SwitchCase: 1}],
			'no-tabs': 0,
			'comma-dangle': 0,
			curly: 0,
			'no-return-assign': 0,
			'no-console': 'off',
			'vue/require-default-prop': 0,
			'vue/no-reserved-keys': 0
		},

		globals: {
			localStorage: false
		},

		env: {
			node: true
		},

		'extends': [
			'plugin:vue/recommended'
		]
}
