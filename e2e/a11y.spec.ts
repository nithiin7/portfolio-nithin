import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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
	test('homepage (default state)', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expectNoViolations(page);
	});

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

	test('case study page', async ({ page }) => {
		await page.goto('/portfolio/2', { waitUntil: 'networkidle' });
		await expectNoViolations(page);
	});

	test('contact page', async ({ page }) => {
		await page.goto('/contact', { waitUntil: 'networkidle' });
		await expectNoViolations(page);
	});

	for (const path of [
		'/blog',
		'/stats',
		'/resume',
		'/this-page-does-not-exist',
	]) {
		test(`page ${path}`, async ({ page }) => {
			await page.goto(path, { waitUntil: 'networkidle' });
			await expectNoViolations(page);
		});
	}

	test('blog post page', async ({ page }) => {
		await page.goto('/blog', { waitUntil: 'networkidle' });
		const href = await page
			.locator('a[href^="/blog/"]')
			.first()
			.getAttribute('href');
		await page.goto(href!, { waitUntil: 'networkidle' });
		await expectNoViolations(page);
	});

	for (const path of ['/', '/portfolio/2', '/blog', '/contact']) {
		test(`light theme ${path}`, async ({ page }) => {
			await page.addInitScript(() => localStorage.setItem('theme', 'light'));
			await page.goto(path, { waitUntil: 'networkidle' });
			await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
			await expectNoViolations(page);
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
		await page.goto('/portfolio/2', { waitUntil: 'networkidle' });
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
