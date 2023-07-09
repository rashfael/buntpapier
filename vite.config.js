// @ts-nocheck
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

export default defineConfig({
	plugins: [
		vue(),
		ReactivityTransform(),
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
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
