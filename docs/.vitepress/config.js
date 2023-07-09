import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

export default {
	title: 'buntpapier',
	description: 'yet another component library',
	dest: 'dist',
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			// { text: 'Installation', link: '/installation' },
			{ text: 'Guide', link: '/guide/getting-started' },
			{ text: 'Components', link: '/components/' },
			// { text: 'Directives', link: '/directives/' },
			// { text: 'Stylus Mixins', link: '/mixins' },
			// { text: 'Validation', link: '/validation' },
		],
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/rashfael/buntpapier' },
		],
		sidebar: {
			'/guide/': [{
				text: 'Guide',
				items: [{
					text: 'Getting Started',
					link: '/guide/getting-started'
				}, {
					text: 'Why buntpapier?',
					link: '/guide/why'
				}, {
					text: 'Migrating from v2',
					link: '/guide/migrating-from-v2'
				}]
			}],
			'/components/': [{
				text: 'Components',
				items: [{
					text: 'button',
					link: '/components/button'
				// }, {
				// 	text: 'icon-button',
				// 	link: '/components/icon-button'
				// }, {
				// 	text: 'link-button',
				// 	link: '/components/link-button'
				}, {
					text: 'input',
					link: '/components/input'
				// }, {
				// 	text: 'select',
				// 	link: '/components/select'
				// }, {
				// 	text: 'checkbox',
				// 	link: '/components/checkbox'
				// }, {
				// 	text: 'radio',
				// 	link: '/components/radio'
				// }, {
				// 	text: 'switch',
				// 	link: '/components/switch'
				// }, {
				// 	text: 'select',
				// 	link: '/components/select'
				// }, {
				// 	text: 'tabs',
				// 	link: '/components/tabs'
				// }, {
				// 	text: 'progress-circular',
				// 	link: '/components/progress-circular'
				}]
			}],
			// '/directives/': [{
			// 	text: 'Directives',
			// 	items: [{
			// 		text: 'scrollbar',
			// 		link: '/directives/scrollbar'
			// 	}, {
			// 		text: 'tooltip',
			// 		link: '/directives/tooltip'
			// 	}, {
			// 		text: 'resize-observer',
			// 		link: '/directives/resize-observer'
			// 	}]
			// }]
		},
		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2016-present rash.codes'
		}
	},
	vite: {
		plugins: [
			ReactivityTransform()
		]
	}
}
