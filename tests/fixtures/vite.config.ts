import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	plugins: [vue(), ReactivityTransform()],
	server: {
		port: 5174,
		strictPort: true
	}
})
