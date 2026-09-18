import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI

export default defineConfig({
	testDir: './tests',
	forbidOnly: CI,
	reporter: CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: 'http://localhost:5173',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } }
	],
	webServer: [{
		command: 'npm run start',
		url: 'http://localhost:5173',
		reuseExistingServer: !CI,
		timeout: 60000
	}, {
		command: 'npx vite --config tests/fixtures/vite.config.ts',
		url: 'http://localhost:5174',
		reuseExistingServer: !CI,
		timeout: 60000
	}]
})
