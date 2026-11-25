import AxeBuilder from '@axe-core/playwright';

import { expect, test } from './fixtures';

const GOOGLE_TAG = /googletagmanager\.com|google-analytics\.com/;

test.use({ consent: 'unset' });

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => sessionStorage.setItem('np:visited', '1'));
});

const banner = (page: import('@playwright/test').Page) =>
	page.getByRole('region', { name: /count your visit/i });

test('no Google tag loads until the visitor accepts', async ({ page }) => {
	const tagRequests: string[] = [];
	page.on('request', (request) => {
		if (GOOGLE_TAG.test(request.url())) tagRequests.push(request.url());
	});

	await page.goto('/', { waitUntil: 'networkidle' });
	await expect(banner(page)).toBeVisible();
	expect(tagRequests).toEqual([]);

	const defaults = await page.evaluate(() =>
		(window.dataLayer ?? []).map((entry) =>
			Array.from(entry as ArrayLike<unknown>)
		)
	);
	expect(defaults[0]).toEqual([
		'consent',
		'default',
		expect.objectContaining({ analytics_storage: 'denied' }),
	]);

	await page.getByRole('button', { name: 'Accept' }).click();
	await expect(banner(page)).toBeHidden();

	const stored = await page.evaluate(() => localStorage.getItem('consent'));
	expect(JSON.parse(stored ?? '{}')).toMatchObject({ analytics: true });
});

test('declining keeps Google tags out across navigations', async ({ page }) => {
	const tagRequests: string[] = [];
	page.on('request', (request) => {
		if (GOOGLE_TAG.test(request.url())) tagRequests.push(request.url());
	});

	await page.goto('/', { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'Decline' }).click();
	await expect(banner(page)).toBeHidden();

	await page.goto('/blog', { waitUntil: 'networkidle' });
	await expect(banner(page)).toBeHidden();
	expect(tagRequests).toEqual([]);
});

test('cookie settings reopen from the footer and return focus', async ({
	page,
}) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'Decline' }).click();

	const opener = page.getByRole('button', { name: 'Cookie settings' });
	await opener.click();
	await expect(page.getByRole('switch', { name: 'Analytics' })).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(banner(page)).toBeHidden();
	await expect(opener).toBeFocused();
});

for (const theme of ['dark', 'light'] as const) {
	test(`banner passes axe in the ${theme} theme`, async ({ page }) => {
		await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.getByRole('button', { name: 'Customise' }).click();
		await expect(page.getByRole('switch', { name: 'Analytics' })).toBeVisible();

		// Mid-fade text trips color-contrast; scan once the card is opaque.
		await page.waitForFunction(() =>
			[
				...document.querySelectorAll(
					'section[aria-labelledby="consent-title"], section[aria-labelledby="consent-title"] *'
				),
			].every((el) => getComputedStyle(el).opacity === '1')
		);

		const { violations } = await new AxeBuilder({ page })
			.include('section[aria-labelledby="consent-title"]')
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();
		expect(violations).toEqual([]);
	});
}
