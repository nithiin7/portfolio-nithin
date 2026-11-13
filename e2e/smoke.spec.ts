import { STATIC_ROUTES, expect, test } from './fixtures';

const firstHref = async (
	page: import('@playwright/test').Page,
	path: string,
	selector: string
): Promise<string> => {
	await page.goto(path);
	const href = await page.locator(selector).first().getAttribute('href');
	expect(href, `no link matching ${selector} on ${path}`).toBeTruthy();
	return href!;
};

test.describe('every route renders', () => {
	for (const path of STATIC_ROUTES.filter((p) => !p.includes('not-exist'))) {
		test(path, async ({ page }) => {
			const response = await page.goto(path);

			expect(response?.status()).toBe(200);
			await expect(page).toHaveTitle(/nithin/i);
			await expect(page.locator('main')).toBeVisible();
			await expect(page.locator('h1').first()).toBeVisible();
		});
	}

	test('a case study', async ({ page }) => {
		const href = await firstHref(page, '/', 'a[href^="/portfolio/"]');
		const response = await page.goto(href);

		expect(response?.status()).toBe(200);
		await expect(page.locator('h1').first()).toBeVisible();
	});

	test('a blog post and its OG image', async ({ page, request }) => {
		const href = await firstHref(
			page,
			'/blog',
			'a[href^="/blog/"]:not([href*="?"])'
		);

		await page.goto(href);
		await expect(page.locator('h1').first()).toBeVisible();

		const og = await request.get(`${href}/opengraph-image`);
		expect(og.status()).toBe(200);
		expect(og.headers()['content-type']).toContain('image/png');
	});

	test('the blog listing links to posts', async ({ page }) => {
		await page.goto('/blog');

		await expect(page).toHaveTitle(/writing/i);
		await expect(page.locator('a[href^="/blog/"]').first()).toBeVisible();
	});

	test('legacy project ids redirect to the slug', async ({ request }) => {
		const response = await request.get('/portfolio/1', { maxRedirects: 0 });

		expect(response.status()).toBe(308);
		expect(response.headers().location).toMatch(/\/portfolio\/[a-z0-9-]+$/);
	});
});

test('unknown routes answer 404 with a way home', async ({ page }) => {
	const response = await page.goto('/this-page-does-not-exist');

	expect(response?.status()).toBe(404);
	await expect(page.locator('h1').first()).toBeVisible();
	await expect(page.locator('main a[href="/"]').first()).toBeVisible();
});

test('navigating between pages swaps content through the transition', async ({
	page,
}) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	await page
		.getByRole('navigation', { name: 'Primary' })
		.getByRole('link', { name: 'Blog' })
		.click();

	await expect(page).toHaveURL(/\/blog$/);
	await expect(page).toHaveTitle(/writing/i);
	await expect(page.locator('main a[href^="/blog/"]').first()).toBeVisible();

	await page.goBack();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('main')).toBeVisible();
});

test.describe('contact form', () => {
	test('shows validation errors on an empty submit', async ({ page }) => {
		// A click before React hydrates falls through to a native GET submit,
		// which reloads the page and restarts hydration — so wait for idle first
		await page.goto('/contact', { waitUntil: 'networkidle' });

		await page.getByRole('button', { name: 'Send message' }).click();

		await expect(page.getByText('Name is required')).toBeVisible();
		await expect(page.getByText('Email is required')).toBeVisible();
		await expect(page.getByText('Message is required')).toBeVisible();
	});

	test('sends and shows the success state (reCAPTCHA and EmailJS mocked)', async ({
		page,
	}) => {
		let sent = false;
		await page.route('**/recaptcha/api.js*', (route) =>
			route.fulfill({
				contentType: 'text/javascript',
				body: 'window.grecaptcha={ready:function(cb){cb()},execute:function(){return Promise.resolve("e2e-token")}};',
			})
		);
		await page.route('**/api.emailjs.com/**', (route) => {
			sent = true;
			return route.fulfill({ status: 200, body: 'OK' });
		});
		await page.goto('/contact', { waitUntil: 'networkidle' });

		await page.getByLabel('Your name').fill('Ada Lovelace');
		await page.getByLabel('Your email').fill('ada@example.com');
		await page.getByLabel('Message').fill('Testing the contact form.');
		await page.getByRole('button', { name: 'Send message' }).click();

		await expect(
			page.getByRole('heading', { name: /thanks, ada/i })
		).toBeVisible();
		expect(sent).toBe(true);
	});
});

test('command palette: search, run a command, Escape returns focus', async ({
	page,
}) => {
	await page.goto('/contact', { waitUntil: 'networkidle' });
	const palette = page.getByRole('dialog', { name: 'Command palette' });

	await page.getByRole('button', { name: 'Send message' }).focus();
	await page.keyboard.press('ControlOrMeta+k');
	await expect(palette).toBeVisible();
	await expect(page.getByRole('combobox')).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(palette).toBeHidden();
	await expect(
		page.getByRole('button', { name: 'Send message' })
	).toBeFocused();

	await page.keyboard.press('ControlOrMeta+k');
	await page.getByRole('combobox').fill('stats');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/stats$/);
	await expect(palette).toBeHidden();
});
