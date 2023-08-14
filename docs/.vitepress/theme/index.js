import DefaultTheme from 'vitepress/theme'
import 'roboto-fontface'
import 'typeface-roboto-mono'
import '@mdi/font/css/materialdesignicons.css'
import Buntpapier from '../../../src/'
import './styles/index.styl'

export default {
	...DefaultTheme,
	enhanceApp({ app, router, siteData }) {
		// app is the Vue 3 app instance from `createApp()`. router is VitePress'
		// custom router. `siteData`` is a `ref`` of current site-level metadata.
		app.use(Buntpapier)
	}
}
