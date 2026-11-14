import { test as base, expect, type BrowserContext } from '@playwright/test';

/**
 * Keeps test runs out of production data: blog view counts are a live
 * Supabase table, so POST /api/views is answered locally.
 */
export const isolate = async (context: BrowserContext): Promise<void> => {
	await context.route('**/api/views', (route) =>
		route.request().method() === 'POST'
			? route.fulfill({ json: { success: true } })
			: route.continue()
	);
};

export const test = base.extend<{ isolated: void }>({
	isolated: [
		async ({ context }, use) => {
			await isolate(context);
			await use();
		},
		{ auto: true },
	],
});

export { expect };

/** Every public route; the case study and post are discovered at runtime. */
export const STATIC_ROUTES = [
	'/',
	'/blog',
	'/contact',
	'/resume',
	'/rss',
	'/stats',
	'/this-page-does-not-exist',
];
