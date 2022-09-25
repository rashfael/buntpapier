import DefaultTheme from 'vitepress/theme'
import '@fontsource/roboto'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto-mono'
import '@fontsource/roboto-mono/400-italic.css'
import '@mdi/font/css/materialdesignicons.css'
import Buntpapier from '../../../src/'
import './styles/index.styl'

import Layout from './Layout.vue'
import Showcase from './Showcase.vue'
import ApiDocs from './ApiDocs.vue'

export default {
	...DefaultTheme,
	Layout,
	enhanceApp({ app, router, siteData }) {
		// app is the Vue 3 app instance from `createApp()`. router is VitePress'
		// custom router. `siteData`` is a `ref`` of current site-level metadata.
		app.use(Buntpapier)
		app.component('Showcase', Showcase)
		app.component('ApiDocs', ApiDocs)
	}
}
