import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import Buntpapier from '../../src'

export async function renderFixture (component) {
	return renderToString(createSSRApp(component).use(Buntpapier))
}
