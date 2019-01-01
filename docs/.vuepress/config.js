module.exports = {
	title: 'buntpapier',
	description: 'yet another component library',
	base: '/buntpapier/',
	dest: 'dist',
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Installation', link: '/installation' },
			{ text: 'Components', link: '/components/' },
			{ text: 'Directives', link: '/directives/' },
			{ text: 'Stylus Mixins', link: '/mixins' },
			{ text: 'Validation', link: '/validation' },
		],
		sidebar: {
			'/components/': [
				'button',
				'icon-button',
				'link-button',
				'input',
				'select',
				'checkbox',
				'switch',
				'tabs',
				'progress-circular'
			],
			'/directives/': [
				'scrollbar',
				'tooltip',
				'resize-observer'
			]
		}
	},
	chainWebpack: (config, isServer) => {
		config.module
		.rule('js')
			.use('babel-loader')
			.tap(options => Object.assign(options, {
				plugins: ["@babel/proposal-optional-chaining"]
			}))
	},
	stylus: {
		preferPathResolver: 'webpack',
		use: [require('../../stylus')()]
	}
}
