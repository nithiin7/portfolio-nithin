import { defineConfig, devices } from '@playwright/test';

// PLAYWRIGHT_BASE_URL points the suite at an already-running server (e.g. a
// `pnpm start -p 3200` build) and skips the managed dev server
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: externalBaseURL ?? 'http://localhost:3000',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: externalBaseURL
		? undefined
		: {
				command: process.env.CI ? 'pnpm start' : 'pnpm dev',
				url: 'http://localhost:3000',
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
});
