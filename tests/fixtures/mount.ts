import { createApp, type Component } from 'vue'
import '@fontsource/roboto'
import '@mdi/font/css/materialdesignicons.css'
// host styles first, library styles after — the layer order is declared here
import './host.sass'
import Buntpapier from '../../src'

// Fixtures import the library source through this project's own toolchain.
// They never import docs examples, VitePress theme code or documentation content.
export function mountFixture (root: Component) {
	createApp(root).use(Buntpapier).mount('#app')
}
