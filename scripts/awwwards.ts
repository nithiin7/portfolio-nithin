/**
 * Captures the Awwwards submission kit (cover + desktop/mobile screenshots)
 * from a running production build:
 *   pnpm build && pnpm start -p 3200
 *   AWWWARDS_BASE_URL=http://localhost:3200 node scripts/awwwards.ts
 */
import { mkdir } from 'node:fs/promises';

import { chromium, type Page } from '@playwright/test';

const BASE_URL = process.env.AWWWARDS_BASE_URL ?? 'http://localhost:3200';
const OUT_DIR = 'docs/redesign/awwwards';

// Floating utilities (chat bubble, ⌘K pill) are app chrome, not the design
const HIDE_CHROME = `
	[class*="FloatingChat"], [class*="CommandPalette__hint"] { display: none !important; }
`;

interface Shot {
	file: string;
	path: string;
	viewport: { width: number; height: number };
	scale: number;
	prepare?: (page: Page) => Promise<void>;
}

const settle = (page: Page): Promise<unknown> =>
	page.evaluate(() =>
		Promise.race([
			Promise.all(
				document
					.getAnimations()
					.filter(
						(a) =>
							a.playState === 'running' &&
							a.effect?.getComputedTiming().endTime !== Infinity
					)
					.map((a) => a.finished.catch(() => undefined))
			),
			new Promise((resolve) => setTimeout(resolve, 4000)),
		])
	);

const scrollTo = async (page: Page, selector: string, offset = 0) => {
	await page.evaluate(
		([sel, off]) => {
			const el = document.querySelector(sel as string);
			if (!el) throw new Error(`missing ${sel}`);
			const top = el.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({ top: top - Number(off), behavior: 'instant' });
		},
		[selector, offset]
	);
	await page.waitForTimeout(1200);
};

const DESKTOP = { width: 1600, height: 1200 };
const MOBILE = { width: 390, height: 844 };

const shots: Shot[] = [
	{ file: 'cover-1600x1200.jpg', path: '/', viewport: DESKTOP, scale: 1 },
	{
		file: 'desktop-1-hero.jpg',
		path: '/',
		viewport: { width: 1920, height: 1080 },
		scale: 1,
	},
	{
		file: 'desktop-2-works-preview.jpg',
		path: '/',
		viewport: { width: 1920, height: 1080 },
		scale: 1,
		prepare: async (page) => {
			await scrollTo(page, 'ul[aria-label^="All projects"]', 520);
			const row = page.locator('ul[aria-label^="All projects"] a').nth(1);
			const box = await row.boundingBox();
			if (box) {
				await page.mouse.move(box.x + box.width * 0.55, box.y + box.height / 2);
				await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2, {
					steps: 12,
				});
			}
			await page.waitForTimeout(1500);
		},
	},
	{
		file: 'desktop-3-case-study.jpg',
		path: '/portfolio/2',
		viewport: { width: 1920, height: 1080 },
		scale: 1,
	},
	{ file: 'mobile-1-hero.jpg', path: '/', viewport: MOBILE, scale: 3 },
	{
		file: 'mobile-2-blog.jpg',
		path: '/blog',
		viewport: MOBILE,
		scale: 3,
	},
];

const run = async (): Promise<void> => {
	await mkdir(OUT_DIR, { recursive: true });
	const browser = await chromium.launch();

	for (const shot of shots) {
		const context = await browser.newContext({
			viewport: shot.viewport,
			deviceScaleFactor: shot.scale,
			isMobile: shot.viewport.width < 768,
			hasTouch: shot.viewport.width < 768,
			colorScheme: 'dark',
		});
		// Skip the first-visit preloader so the page is captured at rest
		await context.addInitScript(() => {
			sessionStorage.setItem('np:visited', '1');
		});
		const page = await context.newPage();
		await page.goto(BASE_URL + shot.path, { waitUntil: 'networkidle' });
		await page.addStyleTag({ content: HIDE_CHROME });
		await settle(page);
		await shot.prepare?.(page);
		await settle(page);
		await page.screenshot({
			path: `${OUT_DIR}/${shot.file}`,
			type: 'jpeg',
			quality: 88,
		});
		console.log(`✓ ${shot.file}`);
		await context.close();
	}

	await browser.close();
};

await run();
