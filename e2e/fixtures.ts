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

/**
 * Records a declined consent choice so the banner stays out of the way and
 * test runs never reach Google Analytics. Set `consent: 'unset'` to test it.
 */
const declineConsent = async (context: BrowserContext): Promise<void> => {
	await context.addInitScript(() => {
		localStorage.setItem(
			'consent',
			JSON.stringify({ v: 1, ts: Date.now(), analytics: false })
		);
	});
};

export const test = base.extend<{
	consent: 'declined' | 'unset';
	isolated: void;
}>({
	consent: ['declined', { option: true }],
	isolated: [
		async ({ context, consent }, use) => {
			await isolate(context);
			if (consent === 'declined') await declineConsent(context);
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
