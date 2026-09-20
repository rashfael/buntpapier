import { defineConfig } from '@playwright/test'
import { CI, engines, sharedUse } from './tests/support/playwright-shared'

// Component behavior against owned fixtures. Starts the fixture server only and
// passes with the docs server stopped. Docs smoke lives in
// playwright.docs.config.ts and CI runs it as a second step.
export default defineConfig({
	testDir: './tests/components',
	testMatch: '**/*.test.ts',
	forbidOnly: CI,
	reporter: [
		...(CI ? [['github', {}] as const] : []),
		['list', {}] as const,
		['html', { open: 'never' }] as const
	],
	use: { ...sharedUse, baseURL: 'http://localhost:5174' },
	projects: engines,
	webServer: [{
		command: 'npx vite --config tests/fixtures/vite.config.ts',
		url: 'http://localhost:5174',
		reuseExistingServer: !CI,
		timeout: 60000
	}]
})
