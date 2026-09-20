import { defineConfig } from '@playwright/test'
import { CI, engines, sharedUse } from './tests/support/playwright-shared'

// Documentation integration smoke. Starts the docs server only, and writes its
// results beside the component run's instead of overwriting them.
export default defineConfig({
	testDir: './tests/docs',
	testMatch: '**/*.test.ts',
	outputDir: './test-results-docs',
	forbidOnly: CI,
	reporter: [
		...(CI ? [['github', {}] as const] : []),
		['list', {}] as const,
		['html', { open: 'never', outputFolder: 'playwright-report-docs' }] as const
	],
	use: { ...sharedUse, baseURL: 'http://localhost:5173' },
	projects: engines,
	webServer: [{
		command: 'npm run start',
		url: 'http://localhost:5173',
		reuseExistingServer: !CI,
		timeout: 60000
	}]
})
