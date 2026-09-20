import { devices, type PlaywrightTestConfig } from '@playwright/test'

export const CI = !!process.env.CI

// Browser and diagnostic options shared by the component and docs configurations.
// Screenshots and traces are kept on failure only, without retries; video is off.
export const sharedUse: PlaywrightTestConfig['use'] = {
	screenshot: 'only-on-failure',
	trace: 'retain-on-failure',
	video: 'off'
}

export const engines = [
	{ name: 'chromium', use: devices['Desktop Chrome'] },
	{ name: 'firefox', use: devices['Desktop Firefox'] },
	{ name: 'webkit', use: devices['Desktop Safari'] }
]
