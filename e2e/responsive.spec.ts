import { expect, test, type Page } from '@playwright/test';

import { STATIC_ROUTES, isolate } from './fixtures';

// Phone floor, the 1920 composition, and the scaled 4K version of it
const WIDTHS = [
	{ width: 320, height: 800 },
	{ width: 1920, height: 1080 },
	{ width: 3840, height: 2160 },
];

const firstHref = async (page: Page, path: string, selector: string) => {
	await page.goto(path);
	const href = await page.locator(selector).first().getAttribute('href');
	expect(href, `no link matching ${selector} on ${path}`).toBeTruthy();
	return href!;
};

// Elements reaching past the viewport that no ancestor clips: the usual culprits
const overflowReport = (page: Page) =>
	page.evaluate(() => {
		const vw = document.documentElement.clientWidth;
		const clipped = (el: Element) => {
			for (
				let n = el.parentElement;
				n && n !== document.body;
				n = n.parentElement
			) {
				if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(n).overflowX))
					return true;
			}
			return false;
		};
		const offenders = [...document.querySelectorAll('body *')]
			.filter((el) => {
				const r = el.getBoundingClientRect();
				return r.width > 0 && r.right > vw + 1 && !clipped(el);
			})
			.slice(0, 5)
			.map(
				(el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`
			);
		return {
			scrollWidth: document.documentElement.scrollWidth,
			viewport: vw,
			offenders,
		};
	});

test.describe('no horizontal overflow', () => {
	let routes: string[] = STATIC_ROUTES;

	test.beforeAll(async ({ browser }) => {
		const page = await browser.newPage();
		const work = await firstHref(page, '/', 'a[href^="/portfolio/"]');
		const post = await firstHref(
			page,
			'/blog',
			'a[href^="/blog/"]:not([href*="?"])'
		);
		routes = [...STATIC_ROUTES, work, post];
		await page.close();
	});

	for (const viewport of WIDTHS) {
		test(`every route fits ${viewport.width}px`, async ({ browser }) => {
			test.setTimeout(120_000);
			const context = await browser.newContext({
				viewport,
				hasTouch: viewport.width < 768,
				isMobile: viewport.width < 768,
			});
			await isolate(context);
			// Skip the first-visit preloader overlay
			await context.addInitScript(() =>
				sessionStorage.setItem('np:visited', '1')
			);
			const page = await context.newPage();

			for (const route of routes) {
				await page.goto(route, { waitUntil: 'networkidle' });
				const report = await overflowReport(page);
				expect
					.soft(
						report.scrollWidth,
						`${route} @ ${viewport.width}px overflows: ${report.offenders.join(', ')}`
					)
					.toBeLessThanOrEqual(report.viewport);
			}

			await context.close();
		});
	}
});
