import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: externalBaseURL ?? 'http://localhost:3000',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
			? {
					'x-vercel-protection-bypass':
						process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
					'x-vercel-set-bypass-cookie': 'true',
				}
			: undefined,
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
