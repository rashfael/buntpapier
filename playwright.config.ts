import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests',
	use: {
		baseURL: 'http://localhost:5173',
	},
	webServer: {
		command: 'npm run start',
		url: 'http://localhost:5173',
		reuseExistingServer: true,
		timeout: 60000
	}
})
