import { expect, test } from '@playwright/test';

test('homepage renders', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle(/nithin/i);
	await expect(page.locator('main')).toBeVisible();
});

test('blog listing renders posts', async ({ page }) => {
	await page.goto('/blog');

	await expect(page).toHaveTitle(/blog/i);
	await expect(page.locator('main')).toBeVisible();
	await expect(page.locator('a[href^="/blog/"]').first()).toBeVisible();
});

test('blog post detail renders from listing', async ({ page }) => {
	await page.goto('/blog');

	const firstPost = page.locator('a[href^="/blog/"]').first();
	const href = await firstPost.getAttribute('href');

	await page.goto(href!);

	await expect(page.locator('main')).toBeVisible();
	await expect(page.locator('h1').first()).toBeVisible();
});

test('contact form shows validation errors on empty submit', async ({
	page,
}) => {
	// A click before React hydrates falls through to a native GET submit,
	// which reloads the page and restarts hydration — so wait for idle first
	await page.goto('/contact', { waitUntil: 'networkidle' });

	await page.getByRole('button', { name: 'Submit' }).click();

	await expect(page.getByText('Name is required')).toBeVisible();
	await expect(page.getByText('Email is required')).toBeVisible();
	await expect(page.getByText('Message is required')).toBeVisible();
});
