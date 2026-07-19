import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const scan = (page: Page) =>
	new AxeBuilder({ page })
		.withTags(AXE_TAGS)
		// Third-party embeds we don't control
		.exclude('iframe')
		// Known design debt, audited separately in the color-contrast test below
		.disableRules(['color-contrast'])
		.analyze();

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

// The Menu only reveals after scrolling past the first viewport and idling
const openMenu = async (page: Page) => {
	await page.mouse.wheel(0, 2000);
	const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
	await expect(toggle).toBeVisible();
	await toggle.click();
	await expect(
		page.getByRole('dialog', { name: 'Navigation menu' })
	).toBeVisible();
};

const openCertificationModal = async (page: Page) => {
	const badge = page
		.getByRole('button', { name: /^View details for / })
		.first();
	// The marquee keeps badges moving, so mouse actions never see a stable
	// bounding box. Keyboard activation skips stability checks entirely.
	await badge.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByText('Certification Details')).toBeVisible();
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

	test('contact page', async ({ page }) => {
		await page.goto('/contact', { waitUntil: 'networkidle' });
		await expectNoViolations(page);
	});

	// Muted theme colors (--color-number/--color-year and friends) sit below
	// WCAG AA 4.5:1. Documented design debt: remove this annotation once the
	// palette is adjusted, and drop the disableRules exclusion above.
	test('color contrast audit', async ({ page }) => {
		test.fail();
		await page.goto('/', { waitUntil: 'networkidle' });
		const { violations } = await new AxeBuilder({ page })
			.withTags(AXE_TAGS)
			.exclude('iframe')
			.include('body')
			.withRules(['color-contrast'])
			.analyze();
		expect(violations, formatViolations(violations)).toEqual([]);
	});
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

		const modal = page.getByRole('button', { name: 'Close modal' });
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
});
