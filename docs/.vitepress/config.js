module.exports = {
	title: 'buntpapier',
	description: 'yet another component library',
	dest: 'dist',
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Installation', link: '/installation' },
			{ text: 'Components', link: '/components/' },
			{ text: 'Directives', link: '/directives/' },
			{ text: 'Stylus Mixins', link: '/mixins' },
			{ text: 'Validation', link: '/validation' },
			{ text: 'Github', link: 'https://github.com/rashfael/buntpapier' },
		],
		sidebar: {
			'/components/': [{
				text: 'Components',
				children: [{
					text: 'button',
					link: '/components/button'
				}, {
					text: 'icon-button',
					link: '/components/icon-button'
				}, {
					text: 'link-button',
					link: '/components/link-button'
				}, {
					text: 'input',
					link: '/components/input'
				}, {
					text: 'select',
					link: '/components/select'
				}, {
					text: 'checkbox',
					link: '/components/checkbox'
				}, {
					text: 'radio',
					link: '/components/radio'
				}, {
					text: 'switch',
					link: '/components/switch'
				}, {
					text: 'select',
					link: '/components/select'
				}, {
					text: 'tabs',
					link: '/components/tabs'
				}, {
					text: 'progress-circular',
					link: '/components/progress-circular'
				}]
			}],
			'/directives/': [{
				text: 'Directives',
				children: [{
					text: 'scrollbar',
					link: '/directives/scrollbar'
				}, {
					text: 'tooltip',
					link: '/directives/tooltip'
				}, {
					text: 'resize-observer',
					link: '/directives/resize-observer'
				}]
			}]
		}
	}
}
