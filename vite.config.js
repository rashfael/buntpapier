import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

export default defineConfig({
	plugins: [
		// vue(),
		// ReactivityTransform(),
		vue({
			// script: {
			// 	propsDestructure: true
			// },
			reactivityTransform: true
		}),
		
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.js'),
			name: 'buntpapier',
			fileName: 'buntpapier'
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
})
