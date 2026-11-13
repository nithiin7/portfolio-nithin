/**
 * Captures the screens listed in projects.config.ts into raw/<slug>/<name>.png.
 * Desktop: 1920×1080 @2x. Mobile: 430×932 @3x. Screens without a `source`
 * are imported PNGs that must already sit in raw/<slug>/.
 *   node scripts/plates/capture.ts [slug…] [--force]
 */
import { access, mkdir } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium, type Browser } from '@playwright/test';

import projects from './projects.config.ts';
import {
	DEVICES,
	rawPath,
	selectProjects,
	type PlateProject,
	type Screen,
} from './shared.ts';

const exists = (path: string): Promise<boolean> =>
	access(path).then(
		() => true,
		() => false
	);

const toUrl = (source: string): string =>
	/^https?:\/\//.test(source)
		? source
		: pathToFileURL(isAbsolute(source) ? source : resolve(source)).href;

const captureScreen = async (
	browser: Browser,
	slug: string,
	screen: Screen & { source: string }
): Promise<void> => {
	const device = DEVICES[screen.device];
	const mobile = screen.device === 'mobile';
	const context = await browser.newContext({
		viewport: { width: device.width, height: device.height },
		deviceScaleFactor: device.dpr,
		isMobile: mobile,
		hasTouch: mobile,
		reducedMotion: 'reduce',
		colorScheme: screen.colorScheme ?? 'light',
	});
	const page = await context.newPage();
	try {
		await page.goto(toUrl(screen.source), { waitUntil: 'networkidle' });
		if (screen.waitFor) await page.waitForSelector(screen.waitFor);
		// nextjs-portal is the dev-server overlay badge, present when capturing `next dev`
		await page.addStyleTag({
			content: `${['nextjs-portal', ...(screen.hide ?? [])].join(', ')} { display: none !important; }`,
		});
		if (screen.scrollTo !== undefined) {
			await page.evaluate((target) => {
				const top =
					typeof target === 'number'
						? target
						: (document.querySelector(target)?.getBoundingClientRect().top ??
								0) + window.scrollY;
				window.scrollTo({ top, behavior: 'instant' });
			}, screen.scrollTo);
		}
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(screen.delay ?? 800);
		const path = rawPath(slug, screen.name);
		await mkdir(dirname(path), { recursive: true });
		await page.screenshot({ path, animations: 'disabled' });
		console.log(`  captured ${slug}/${screen.name}.png`);
	} finally {
		await context.close();
	}
};

export const capture = async (
	selected: PlateProject[],
	{ force = false } = {}
): Promise<void> => {
	let browser: Browser | undefined;
	try {
		for (const project of selected) {
			for (const screen of project.screens ?? []) {
				const path = rawPath(project.slug, screen.name);
				if (!screen.source) {
					if (!(await exists(path))) {
						throw new Error(
							`${project.slug}/${screen.name}: no source and no imported PNG at ${path}`
						);
					}
					console.log(`  imported ${project.slug}/${screen.name}.png`);
					continue;
				}
				if (!force && (await exists(path))) {
					console.log(`  cached   ${project.slug}/${screen.name}.png`);
					continue;
				}
				browser ??= await chromium.launch();
				await captureScreen(browser, project.slug, {
					...screen,
					source: screen.source,
				});
			}
		}
	} finally {
		await browser?.close();
	}
};

if (import.meta.main) {
	await capture(selectProjects(projects), {
		force: process.argv.includes('--force'),
	});
}
