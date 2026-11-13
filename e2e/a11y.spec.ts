import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { STATIC_ROUTES, expect, test } from './fixtures';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// Mid-fade text blends with the background and trips color-contrast, so let
// every finite animation (intros, reveals, dialog entrances) finish first.
// Infinite ones (marquee, status pulse) never settle and are skipped.
const SETTLE_TIMEOUT = 4000;

const settle = (page: Page) =>
	page.evaluate(
		(timeout) =>
			Promise.race([
				Promise.all(
					document
						.getAnimations()
						.filter(
							(animation) =>
								animation.playState === 'running' &&
								animation.effect?.getComputedTiming().endTime !== Infinity
						)
						.map((animation) => animation.finished.catch(() => undefined))
				),
				new Promise((resolve) => setTimeout(resolve, timeout)),
			]),
		SETTLE_TIMEOUT
	);

const scan = async (page: Page) => {
	await settle(page);
	return (
		new AxeBuilder({ page })
			.withTags(AXE_TAGS)
			// Third-party embeds we don't control
			.exclude('iframe')
			.analyze()
	);
};

const formatViolations = (
	violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']
) =>
	violations
		.map(
			(v) =>
				`[${v.impact}] ${v.id}: ${v.help}\n` +
				v.nodes.map((n) => `  → ${n.target.join(' ')}`).join('\n')
		)
		.join('\n\n');

const expectNoViolations = async (page: Page) => {
	const { violations } = await scan(page);
	expect(violations, formatViolations(violations)).toEqual([]);
};

const openMenu = async (page: Page) => {
	const toggle = page.getByRole('button', { name: 'Menu', exact: true });
	await expect(toggle).toBeVisible();
	await toggle.click();
	await expect(
		page.getByRole('dialog', { name: 'Navigation menu' })
	).toBeVisible();
};

const openCertificationModal = async (page: Page) => {
	const badge = page.getByRole('button', { name: /\. View details$/ }).first();
	await badge.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('dialog')).toBeVisible();
};

test.describe('axe scans', () => {
	test('navigation menu open', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await openMenu(page);
		await expectNoViolations(page);
	});

	test('command palette open', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.keyboard.press('ControlOrMeta+k');
		await expect(
			page.getByRole('dialog', { name: 'Command palette' })
		).toBeVisible();
		await expectNoViolations(page);
	});

	test('certification modal open', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await openCertificationModal(page);
		await expectNoViolations(page);
	});

	const THEMES = ['dark', 'light'] as const;

	for (const theme of THEMES) {
		test.describe(`${theme} theme`, () => {
			test.beforeEach(async ({ page }) => {
				await page.addInitScript(
					(t) => localStorage.setItem('theme', t),
					theme
				);
			});

			const check = async (page: Page, path: string) => {
				await page.goto(path, { waitUntil: 'networkidle' });
				await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
				await expectNoViolations(page);
			};

			for (const path of STATIC_ROUTES) {
				test(`page ${path}`, async ({ page }) => check(page, path));
			}

			test('case study page', async ({ page }) => {
				await page.goto('/');
				const href = await page
					.locator('a[href^="/portfolio/"]')
					.first()
					.getAttribute('href');
				await check(page, href!);
			});

			test('blog post page', async ({ page }) => {
				await page.goto('/blog');
				const href = await page
					.locator('a[href^="/blog/"]:not([href*="?"])')
					.first()
					.getAttribute('href');
				await check(page, href!);
			});
		});
	}
});

test.describe('keyboard behavior', () => {
	test('menu closes on Escape and traps Tab focus', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await openMenu(page);

		const panel = page.getByRole('dialog', { name: 'Navigation menu' });

		// Tab repeatedly — focus must stay inside the panel
		for (let i = 0; i < 12; i++) {
			await page.keyboard.press('Tab');
			const inside = await panel.evaluate((el) =>
				el.contains(document.activeElement)
			);
			expect(inside, `focus escaped the menu after ${i + 1} Tabs`).toBe(true);
		}

		await page.keyboard.press('Escape');
		await expect(panel).toBeHidden();
	});

	test('command palette: arrows move selection, Escape closes', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.keyboard.press('ControlOrMeta+k');

		const dialog = page.getByRole('dialog', { name: 'Command palette' });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('combobox')).toBeFocused();

		await page.keyboard.press('ArrowDown');
		const selected = dialog.getByRole('option', { selected: true });
		await expect(selected).not.toHaveText('Home');

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
	});

	test('certification modal: Escape closes, focus trapped and restored', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await openCertificationModal(page);

		const modal = page.getByRole('button', { name: 'Close dialog' });
		await expect(modal).toBeVisible();

		// Focus must land inside the modal, not stay on the page behind it
		const focusInModal = await page.evaluate(() => {
			const active = document.activeElement;
			return !!active?.closest('[class*="Modal"]');
		});
		expect(focusInModal, 'focus did not move into the modal on open').toBe(
			true
		);

		await page.keyboard.press('Escape');
		await expect(modal).toBeHidden();
	});

	test('company logos: linked marks take a visible focus ring, decorative ones stay silent', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		const collaborations = page.locator('#collaborations');
		const links = collaborations.getByRole('link', {
			name: /\(opens in a new tab\)$/,
		});
		expect(await links.count()).toBeGreaterThan(0);

		// Only the first marquee copy is in the tab order
		const tabbable = collaborations.locator('a:not([tabindex="-1"])');
		expect(await tabbable.count()).toBe(await links.count());

		const first = tabbable.first();
		await first.focus();
		await page.keyboard.press('Shift+Tab');
		await page.keyboard.press('Tab');
		await expect(first).toBeFocused();
		await expect(first).toHaveAttribute('target', '_blank');
		await expect(first).toHaveAttribute('rel', 'noopener noreferrer');
		const outline = await first.evaluate(
			(el) => getComputedStyle(el).outlineStyle
		);
		expect(outline).not.toBe('none');

		// Career and testimonial logos sit beside the printed name
		for (const section of ['#career', '#testimonials']) {
			const marks = page.locator(`${section} [style*="--logo"]`);
			for (const mark of await marks.all()) {
				expect(
					await mark.evaluate((el) => !!el.closest('[aria-hidden="true"]'))
				).toBe(true);
			}
		}
		await expect(
			page.locator('#career [style*="--logo"]').first()
		).toBeAttached();
	});

	test('works index: arrow keys move focus and focus opens the preview', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		const rows = page.locator('ul[aria-label^="All projects"] a');
		const preview = page.locator('[class*="WorksPreview__window"]');

		await rows.first().focus();
		await page.keyboard.press('ArrowDown');
		await expect(rows.nth(1)).toBeFocused();
		await expect(rows.nth(1)).toHaveAttribute('tabindex', '0');
		await expect(rows.first()).toHaveAttribute('tabindex', '-1');
		await expect(preview).toHaveAttribute('data-open', 'true');

		await expectNoViolations(page);

		await page.keyboard.press('Shift+Tab');
		await expect(preview).toHaveAttribute('data-open', 'false');
	});

	test('case study gallery: lightbox pages with arrows, Escape restores focus', async ({
		page,
	}) => {
		await page.goto('/portfolio/persona', { waitUntil: 'networkidle' });
		const opener = page.getByRole('button', { name: /^Enlarge image 1 of / });
		await opener.focus();
		await page.keyboard.press('Enter');

		const dialog = page.getByRole('dialog', { name: /gallery$/ });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByText(/^01\//)).toBeVisible();
		await page.keyboard.press('ArrowRight');
		await expect(dialog.getByText(/^02\//)).toBeVisible();
		await expectNoViolations(page);

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		await expect(opener).toBeFocused();
	});
});
