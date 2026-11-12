import { resolve } from 'node:path';

import { MASTER, safeZone } from '../../src/config/imageCrops.ts';
import type { ImageField } from '../../src/config/imageCrops.ts';
import { palette } from '../../src/styles/tokens.ts';
import type { PlateSurface } from '../../src/types/plates.ts';

export type { PlateManifestEntry } from '../../src/types/plates.ts';

export type Device = 'desktop' | 'mobile';
export type Surface = PlateSurface;

export const DEVICES: Record<
	Device,
	{ width: number; height: number; dpr: number }
> = {
	desktop: { width: 1920, height: 1080, dpr: 2 },
	mobile: { width: 430, height: 932, dpr: 3 },
};

export interface Screen {
	/** File stem: raw/<slug>/<name>.png. */
	name: string;
	device: Device;
	/**
	 * http(s) URL or a local .html file to capture. Omit to import an existing
	 * PNG already placed at raw/<slug>/<name>.png.
	 */
	source?: string;
	/** Device pixel ratio of an imported PNG, when it differs from the device default. */
	dpr?: number;
	/** Selector to wait for before capturing. */
	waitFor?: string;
	/** Selector (or y offset in CSS px) to scroll to before capturing. */
	scrollTo?: string | number;
	/** Selectors hidden before capture (cookie banners, chat bubbles…). */
	hide?: string[];
	/** prefers-color-scheme for the capture; defaults to light. */
	colorScheme?: 'light' | 'dark';
	/** Extra wait in ms after load and scroll, for entrance animations. */
	delay?: number;
	/** CSS px cut from each edge before composing (dev badges, browser chrome…). */
	trim?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
}

/** One screen, or a different screen per surface (e.g. the app's dark mode on ink). */
export type ScreenRef = string | Record<Surface, string>;

/** CSS px of the screen (source px ÷ dpr). */
export interface Region {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface PlateBase {
	/** Output suffix; defaults to the template name. */
	name?: string;
	/** Required: plates ship with their alt text (see docs/redesign/IMAGES.md). */
	alt: string;
	/** Contentful slots this plate is uploaded to. */
	use?: ImageField[];
	/** Several surfaces emit one plate each, suffixed -ink / -paper. */
	surface?: Surface | Surface[];
	grid?: boolean;
}

export type PlateSpec = PlateBase &
	(
		| { template: 'cover'; screen: ScreenRef }
		| {
				template: 'detail';
				screen: ScreenRef;
				region: Region;
				/**
				 * Plate px per CSS px (2–3). Defaults to the screen's DPR, which places
				 * source pixels 1:1; the region is shrunk to fit the safe zone if needed.
				 */
				zoom?: number;
		  }
		| { template: 'mobile-trio'; screens: [string, string, string] }
		| {
				template: 'type-plate';
				variant: 'code' | 'terminal' | 'statement';
				text: string;
				/** Mono label above the excerpt: file name, shell, or kicker. */
				label?: string;
		  }
	);

export interface PlateProject {
	/** PortfolioDetails.slug in Contentful. */
	slug: string;
	surface?: Surface | Surface[];
	grid?: boolean;
	screens?: Screen[];
	plates: PlateSpec[];
}

export const defineProjects = (projects: PlateProject[]): PlateProject[] =>
	projects;

export const PLATES_DIR = resolve(import.meta.dirname);
export const RAW_DIR = resolve(PLATES_DIR, 'raw');
export const OUT_DIR = resolve(PLATES_DIR, 'out');

export const rawPath = (slug: string, screen: string): string =>
	resolve(RAW_DIR, slug, `${screen}.png`);

export const plateName = (
	slug: string,
	plate: PlateSpec,
	variant?: Surface
): string =>
	`${slug}--${plate.name ?? plate.template}${variant ? `-${variant}` : ''}`;

export { MASTER };
export const SAFE = safeZone();
export const SAFE_LEFT = Math.round((MASTER.width - SAFE.width) / 2);
export const SAFE_TOP = Math.round((MASTER.height - SAFE.height) / 2);

export const surfaceColors = (surface: Surface) =>
	surface === 'ink'
		? { bg: palette.ink, fg: palette.paper, muted: palette.grey500 }
		: { bg: palette.paper, fg: palette.ink, muted: palette.grey500 };

/** Picks projects named on the CLI (`node compose.ts persona`), or all of them. */
export const selectProjects = (
	projects: PlateProject[],
	args: string[] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
): PlateProject[] => {
	if (args.length === 0) return projects;
	const unknown = args.filter((a) => !projects.some((p) => p.slug === a));
	if (unknown.length)
		throw new Error(`Unknown project(s): ${unknown.join(', ')}`);
	return projects.filter((p) => args.includes(p.slug));
};
