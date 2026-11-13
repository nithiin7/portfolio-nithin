/**
 * Dev-only responsive audit: screenshots every route at every breakpoint in
 * both themes and measures layout problems in the page itself.
 *   pnpm dev   (or: pnpm build && pnpm start -p 3200)
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/responsive-audit.ts
 * Optional: AUDIT_ONLY=360,1920,3840  AUDIT_THEMES=dark  AUDIT_OUT=.responsive-audit/after
 * AUDIT_STABLE=1 renders with reduced motion and a frozen clock, so two runs can
 * be pixel-diffed (scramble glyphs, the live clock and pulses otherwise differ).
 * Writes .responsive-audit/{dark,light}/*.jpg, overlays/*.jpg and report.json.
 */
import { mkdir, writeFile } from 'node:fs/promises';

import { type Browser, chromium, type Page } from '@playwright/test';

const BASE_URL = process.env.AUDIT_BASE_URL ?? 'http://localhost:3000';
const OUT_DIR = process.env.AUDIT_OUT ?? '.responsive-audit';
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY ?? 3);
const STABLE = process.env.AUDIT_STABLE === '1';

type Theme = 'dark' | 'light';

interface Viewport {
	label: string;
	width: number;
	height: number;
	touch: boolean;
}

const VIEWPORTS: Viewport[] = [
	{ label: '320', width: 320, height: 800, touch: true },
	{ label: '360', width: 360, height: 800, touch: true },
	{ label: '390', width: 390, height: 844, touch: true },
	{ label: '768', width: 768, height: 1024, touch: true },
	{ label: '1024', width: 1024, height: 800, touch: false },
	{ label: '1280', width: 1280, height: 800, touch: false },
	{ label: '1440', width: 1440, height: 900, touch: false },
	{ label: '1920', width: 1920, height: 1080, touch: false },
	{ label: '2560', width: 2560, height: 1440, touch: false },
	{ label: '3840', width: 3840, height: 2160, touch: false },
	{ label: '844x390', width: 844, height: 390, touch: true },
];

const only = process.env.AUDIT_ONLY?.split(',');
const viewports = only
	? VIEWPORTS.filter((v) => only.includes(v.label))
	: VIEWPORTS;
const themes = (process.env.AUDIT_THEMES?.split(',') ?? [
	'dark',
	'light',
]) as Theme[];

// Collected inside the page. Kept dependency-free: it is serialised into the browser.
const measure = (touch: boolean) => {
	const vw = window.innerWidth;
	const vh = window.innerHeight;

	const bem = (cls: string): string =>
		cls
			.replace(/^.+?-module(?:-scss-module)?__.{6}__/, '')
			.replace(/^[a-z0-9]{5,}_/i, '');

	const label = (el: Element): string => {
		const own = [...el.classList].map(bem).find((c) => /^[A-Z]/.test(c));
		if (own) return own;
		const parent = el.parentElement?.closest('[class]');
		const inherited = parent
			? [...parent.classList].map(bem).find((c) => /^[A-Z]/.test(c))
			: undefined;
		return `${inherited ?? ''} ${el.tagName.toLowerCase()}`.trim();
	};

	const sectionOf = (el: Element): string => {
		const section = el.closest(
			'section, header, footer, nav, aside, [role=dialog]'
		);
		return section ? label(section).split('__')[0]! : 'page';
	};

	const visible = (el: Element): boolean => {
		const style = getComputedStyle(el);
		if (style.visibility === 'hidden' || style.display === 'none') return false;
		const rect = el.getBoundingClientRect();
		return rect.width > 0 && rect.height > 0;
	};

	const clippedX = (el: Element): boolean => {
		let node = el.parentElement;
		while (node && node !== document.documentElement) {
			const style = getComputedStyle(node);
			if (/(hidden|clip|auto|scroll)/.test(style.overflowX)) {
				const rect = node.getBoundingClientRect();
				if (rect.right <= vw + 1 && rect.left >= -1) return true;
			}
			if (
				style.position === 'fixed' &&
				node.getBoundingClientRect().width <= vw
			)
				return false;
			node = node.parentElement;
		}
		return false;
	};

	const all = [...document.querySelectorAll('body *')].filter(visible);
	const scrollY = window.scrollY;

	const overflow = {
		scrollWidth: document.documentElement.scrollWidth,
		offenders: all
			.filter((el) => {
				const rect = el.getBoundingClientRect();
				return (rect.right > vw + 1 || rect.left < -1) && !clippedX(el);
			})
			.map((el) => {
				const rect = el.getBoundingClientRect();
				return `${label(el)} [${Math.round(rect.left)}→${Math.round(rect.right)}]`;
			})
			.slice(0, 8),
	};

	const textEls = all.filter((el) =>
		[...el.childNodes].some(
			(n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim().length > 1
		)
	);
	const fontSizes = textEls.map((el) => ({
		el,
		size: parseFloat(getComputedStyle(el).fontSize),
	}));
	const smallText = fontSizes
		.filter((t) => t.size < 12 && !t.el.closest('[aria-hidden="true"]'))
		.map((t) => `${label(t.el)} ${t.size}px`);

	const longLines = all
		.filter((el) => /^(P|LI|BLOCKQUOTE|DD|FIGCAPTION)$/.test(el.tagName))
		.filter((el) => (el.textContent ?? '').trim().length > 160)
		.map((el) => {
			const style = getComputedStyle(el);
			const probe = document.createElement('span');
			probe.textContent = '0'.repeat(20);
			probe.style.cssText =
				'position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit';
			el.appendChild(probe);
			const ch = probe.getBoundingClientRect().width / 20;
			probe.remove();
			const width =
				el.getBoundingClientRect().width -
				parseFloat(style.paddingLeft) -
				parseFloat(style.paddingRight);
			return { el, chars: Math.round(width / ch) };
		})
		.filter((l) => l.chars > 80)
		.map((l) => `${sectionOf(l.el)} › ${label(l.el)} ~${l.chars}ch`);

	// Content extent per top-level block: how much of the viewport the content uses
	const blocks = [
		...document.querySelectorAll(
			'main section, main > * > header, main article, body > footer, footer[class]'
		),
	]
		.filter(visible)
		.filter((el) => !el.parentElement?.closest('main section'));
	const gutters = blocks
		.map((block) => {
			const content = [...block.querySelectorAll('*')].filter(
				(el) =>
					visible(el) &&
					(el.tagName === 'IMG' ||
						el.tagName === 'VIDEO' ||
						[...el.childNodes].some(
							(n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim()
						))
			);
			if (!content.length) return null;
			let left = Infinity;
			let right = -Infinity;
			for (const el of content) {
				const rect = el.getBoundingClientRect();
				if (rect.right < 0 || rect.left > vw) continue;
				left = Math.min(left, rect.left);
				right = Math.max(right, rect.right);
			}
			if (!Number.isFinite(left)) return null;
			return {
				block: label(block),
				leftPct: Math.round((left / vw) * 100),
				rightPct: Math.round(((vw - right) / vw) * 100),
			};
		})
		.filter((g): g is NonNullable<typeof g> => g !== null);

	const images = [...document.querySelectorAll('img')]
		.filter(visible)
		.map((img) => {
			const rect = img.getBoundingClientRect();
			const style = getComputedStyle(img);
			const isVector = /\.svg(\?|$)|image\/svg/.test(img.currentSrc);
			const natural = img.naturalWidth;
			const blurry =
				!isVector && img.complete && natural > 0 && natural < rect.width * 0.9;
			const naturalRatio = img.naturalWidth / (img.naturalHeight || 1);
			const renderedRatio = rect.width / (rect.height || 1);
			const stretched =
				style.objectFit === 'fill' &&
				natural > 0 &&
				Math.abs(naturalRatio / renderedRatio - 1) > 0.03;
			return {
				where: `${sectionOf(img)} › ${label(img)}`,
				rendered: Math.round(rect.width),
				natural,
				blurry,
				stretched,
				sizes: img.sizes || null,
			};
		})
		.filter((i) => i.blurry || i.stretched);

	const tapTargets = touch
		? all
				.filter((el) =>
					el.matches(
						'a[href], button, input, select, textarea, [role=button], [role=tab]'
					)
				)
				.filter(
					(el) =>
						!el.closest('p, li > p, [class*="prose"], [class*="RichText"]')
				)
				.filter((el) => {
					const rect = el.getBoundingClientRect();
					return rect.width < 43.5 || rect.height < 43.5;
				})
				.map((el) => {
					const rect = el.getBoundingClientRect();
					return `${sectionOf(el)} › ${label(el)} ${Math.round(rect.width)}×${Math.round(rect.height)}`;
				})
		: [];

	const fixedCut = all
		.filter((el) => getComputedStyle(el).position === 'fixed')
		.filter((el) => {
			const rect = el.getBoundingClientRect();
			return (
				rect.left < -1 ||
				rect.right > vw + 1 ||
				rect.top < -1 ||
				rect.bottom > vh + 1
			);
		})
		.filter((el) => {
			// fully off-screen parked drawers are intentional
			const rect = el.getBoundingClientRect();
			return (
				rect.right > 0 && rect.left < vw && rect.bottom > 0 && rect.top < vh
			);
		})
		.map((el) => {
			const rect = el.getBoundingClientRect();
			return `${label(el)} [${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}×${Math.round(rect.height)}]`;
		});

	const sizesArr = fontSizes.map((f) => f.size);

	window.scrollTo(0, scrollY);
	return {
		viewport: { vw, vh },
		rootFontSize: parseFloat(
			getComputedStyle(document.documentElement).fontSize
		),
		maxFontSize: Math.max(...sizesArr),
		bodyFontSize: parseFloat(getComputedStyle(document.body).fontSize),
		pageHeight: document.documentElement.scrollHeight,
		overflow,
		smallText: [...new Set(smallText)].slice(0, 12),
		longLines: [...new Set(longLines)].slice(0, 12),
		gutters,
		images,
		tapTargets: [...new Set(tapTargets)].slice(0, 20),
		fixedCut: [...new Set(fixedCut)],
	};
};

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
			new Promise((resolve) => setTimeout(resolve, 3000)),
		])
	);

// Walk the page so whileInView reveals and lazy images fire before capture
const scrollThrough = async (page: Page): Promise<void> => {
	await page.evaluate(async () => {
		const step = window.innerHeight * 0.7;
		for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
			window.scrollTo({ top: y, behavior: 'instant' });
			await new Promise((r) => setTimeout(r, 220));
		}
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
	await page.waitForTimeout(600);
	await settle(page);
};

const newPage = async (
	browser: Browser,
	viewport: Viewport,
	theme: Theme
): Promise<Page> => {
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		deviceScaleFactor: 1,
		isMobile: viewport.touch,
		hasTouch: viewport.touch,
		colorScheme: theme,
		reducedMotion: STABLE ? 'reduce' : 'no-preference',
	});
	if (STABLE)
		await context.clock.setFixedTime(new Date('2026-01-01T06:30:00Z'));
	await context.addInitScript((t) => {
		sessionStorage.setItem('np:visited', '1');
		localStorage.setItem('theme', t);
	}, theme);
	return context.newPage();
};

const discoverRoutes = async (
	browser: Browser
): Promise<Record<string, string>> => {
	const page = await newPage(browser, VIEWPORTS[6]!, 'dark');
	await page.goto(`${BASE_URL}/`, {
		waitUntil: 'networkidle',
		timeout: 120_000,
	});
	const work = await page
		.locator('a[href^="/portfolio/"]')
		.first()
		.getAttribute('href');
	await page.goto(`${BASE_URL}/blog`, {
		waitUntil: 'networkidle',
		timeout: 120_000,
	});
	const post = await page
		.locator('a[href^="/blog/"]:not([href*="?"])')
		.first()
		.getAttribute('href');
	await page.context().close();
	return {
		home: '/',
		work: work!,
		blog: '/blog',
		post: post!,
		contact: '/contact',
		stats: '/stats',
		'404': '/this-page-does-not-exist',
	};
};

type Report = Record<string, unknown>;

const auditRoute = async (
	browser: Browser,
	name: string,
	path: string,
	viewport: Viewport,
	theme: Theme
): Promise<Report> => {
	const page = await newPage(browser, viewport, theme);
	try {
		await page.goto(BASE_URL + path, {
			waitUntil: 'networkidle',
			timeout: 120_000,
		});
		await settle(page);
		await scrollThrough(page);
		const data = await page.evaluate(measure, viewport.touch);
		await page.screenshot({
			path: `${OUT_DIR}/${theme}/${name}-${viewport.label}.jpg`,
			type: 'jpeg',
			quality: 70,
			fullPage: true,
		});
		return data;
	} catch (error) {
		return { error: String(error) };
	} finally {
		await page.context().close();
	}
};

interface Overlay {
	name: string;
	open: (page: Page) => Promise<void>;
}

const OVERLAYS: Overlay[] = [
	{
		name: 'palette',
		open: async (page) => {
			await page.keyboard.press('ControlOrMeta+k');
			await page.getByRole('dialog', { name: 'Command palette' }).waitFor();
		},
	},
	{
		name: 'cert-modal',
		open: async (page) => {
			const badge = page
				.getByRole('button', { name: /\. View details$/ })
				.first();
			await badge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(800);
			await badge.click();
			await page.getByRole('dialog').waitFor();
		},
	},
	{
		name: 'chat',
		open: async (page) => {
			await page
				.getByRole('button', { name: /^Chat with Nithin/ })
				.first()
				.click();
			await page.getByRole('dialog', { name: 'Chat with Nithin' }).waitFor();
		},
	},
	{
		name: 'menu',
		open: async (page) => {
			await page.getByRole('button', { name: 'Menu', exact: true }).click();
			await page.getByRole('dialog', { name: 'Navigation menu' }).waitFor();
		},
	},
];

const OVERLAY_VIEWPORTS = ['360', '1440', '3840', '844x390'];

const auditOverlay = async (
	browser: Browser,
	overlay: Overlay,
	viewport: Viewport,
	theme: Theme
): Promise<Report> => {
	const page = await newPage(browser, viewport, theme);
	try {
		await page.goto(`${BASE_URL}/`, {
			waitUntil: 'networkidle',
			timeout: 120_000,
		});
		await settle(page);
		await overlay.open(page);
		await page.waitForTimeout(1500);
		await settle(page);
		const data = await page.evaluate(measure, viewport.touch);
		await page.screenshot({
			path: `${OUT_DIR}/overlays/${overlay.name}-${theme}-${viewport.label}.jpg`,
			type: 'jpeg',
			quality: 75,
		});
		return data;
	} catch (error) {
		return { error: String(error) };
	} finally {
		await page.context().close();
	}
};

const pool = async (tasks: (() => Promise<void>)[], size: number) => {
	const queue = [...tasks];
	await Promise.all(
		Array.from({ length: size }, async () => {
			while (queue.length) await queue.shift()!();
		})
	);
};

const run = async (): Promise<void> => {
	for (const dir of [...themes, 'overlays'])
		await mkdir(`${OUT_DIR}/${dir}`, { recursive: true });
	const browser = await chromium.launch();
	const routes = await discoverRoutes(browser);
	console.log('routes', routes);

	const report: Record<string, Report> = {};
	const tasks: (() => Promise<void>)[] = [];

	// Warm the dev server so compile time doesn't skew the first batch
	for (const path of Object.values(routes))
		await fetch(BASE_URL + path).catch(() => undefined);

	for (const theme of themes)
		for (const viewport of viewports)
			for (const [name, path] of Object.entries(routes))
				tasks.push(async () => {
					const key = `${theme}/${name}-${viewport.label}`;
					report[key] = await auditRoute(browser, name, path, viewport, theme);
					console.log(`✓ ${key}`);
				});

	for (const theme of themes)
		for (const viewport of viewports.filter((v) =>
			OVERLAY_VIEWPORTS.includes(v.label)
		))
			for (const overlay of OVERLAYS) {
				if (overlay.name === 'menu' && !viewport.touch) continue;
				tasks.push(async () => {
					const key = `overlays/${overlay.name}-${theme}-${viewport.label}`;
					report[key] = await auditOverlay(browser, overlay, viewport, theme);
					console.log(`✓ ${key}`);
				});
			}

	await pool(tasks, CONCURRENCY);
	await browser.close();
	await writeFile(
		`${OUT_DIR}/report.json`,
		JSON.stringify({ routes, report }, null, 2)
	);
	console.log(`report → ${OUT_DIR}/report.json`);
};

await run();
