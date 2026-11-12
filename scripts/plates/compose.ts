/**
 * Composes 3840×2160 editorial plates from raw/<slug>/*.png into out/<slug>/,
 * plus a .debug.png with the 21:9 / 16:9 / 16:10 / 4:3 crop guides and a
 * plates.json manifest for /dev/plates and upload.ts.
 *   node scripts/plates/compose.ts [slug…]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { ImageResponse } from 'next/og.js';
import { createElement as h, type ReactElement } from 'react';
import sharp, { type OverlayOptions } from 'sharp';

import projects from './projects.config.ts';
import {
	DEVICES,
	MASTER,
	OUT_DIR,
	SAFE,
	SAFE_LEFT,
	SAFE_TOP,
	plateName,
	rawPath,
	selectProjects,
	surfaceColors,
	type PlateManifestEntry,
	type PlateProject,
	type PlateSpec,
	type Screen,
	type ScreenRef,
	type Surface,
} from './shared.ts';
import { visibleBox } from '../../src/config/imageCrops.ts';
import { lineAlpha, palette } from '../../src/styles/tokens.ts';

type Spec<T extends PlateSpec['template']> = Extract<
	PlateSpec,
	{ template: T }
>;

const COVER_WIDTH = 0.8;
const MAX_HEIGHT = 0.9;
const GRID_COLUMNS = 12;

const rgba = (hex: string, alpha: number): string => {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const hairline = (surface: Surface, strength = 1): string =>
	rgba(
		surfaceColors(surface).fg,
		(surface === 'ink' ? lineAlpha.onInk : lineAlpha.onPaper) * strength
	);

const svg = (body: string): OverlayOptions => ({
	input: Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${MASTER.width}" height="${MASTER.height}" shape-rendering="crispEdges">${body}</svg>`
	),
	left: 0,
	top: 0,
});

const gridLines = (surface: Surface): string => {
	const stroke = hairline(surface, 0.5);
	const column = SAFE.width / GRID_COLUMNS;
	const verticals = Array.from({ length: GRID_COLUMNS + 1 }, (_, i) => {
		const x = Math.round(SAFE_LEFT + i * column) + 0.5;
		return `<line x1="${x}" y1="0" x2="${x}" y2="${MASTER.height}" />`;
	});
	const horizontals = [SAFE_TOP, SAFE_TOP + SAFE.height].map(
		(y) =>
			`<line x1="0" y1="${y + 0.5}" x2="${MASTER.width}" y2="${y + 0.5}" />`
	);
	return `<g stroke="${stroke}" stroke-width="1">${[...verticals, ...horizontals].join('')}</g>`;
};

interface Placed {
	left: number;
	top: number;
	width: number;
	height: number;
}

/** 1px frame drawn just outside the image so it never covers screen pixels. */
const frame = ({ left, top, width, height }: Placed, surface: Surface) =>
	`<rect x="${left - 0.5}" y="${top - 0.5}" width="${width + 1}" height="${height + 1}" fill="none" stroke="${hairline(surface, 2)}" stroke-width="1" />`;

const fit = (
	source: { width: number; height: number },
	maxWidth: number,
	maxHeight: number
) => {
	const scale = Math.min(maxWidth / source.width, maxHeight / source.height);
	return {
		width: Math.round(source.width * scale),
		height: Math.round(source.height * scale),
	};
};

const centred = (size: { width: number; height: number }): Placed => ({
	...size,
	left: Math.round((MASTER.width - size.width) / 2),
	top: Math.round((MASTER.height - size.height) / 2),
});

const findScreen = (project: PlateProject, name: string): Screen => {
	const screen = project.screens?.find((s) => s.name === name);
	if (!screen) throw new Error(`${project.slug}: unknown screen "${name}"`);
	return screen;
};

const resolveScreen = (ref: ScreenRef, surface: Surface): string =>
	typeof ref === 'string' ? ref : ref[surface];

/** Raw screen with its `trim` applied, as a PNG buffer. */
const loadScreen = async (project: PlateProject, name: string) => {
	const screen = findScreen(project, name);
	const path = rawPath(project.slug, name);
	const meta = await sharp(path).metadata();
	if (!meta.width || !meta.height) throw new Error(`Unreadable ${path}`);
	const dpr = screen.dpr ?? DEVICES[screen.device].dpr;
	const { top = 0, right = 0, bottom = 0, left = 0 } = screen.trim ?? {};
	const box = {
		left: Math.round(left * dpr),
		top: Math.round(top * dpr),
		width: meta.width - Math.round((left + right) * dpr),
		height: meta.height - Math.round((top + bottom) * dpr),
	};
	const input = await sharp(path).extract(box).png().toBuffer();
	return { name, input, width: box.width, height: box.height, dpr };
};

const resized = (input: Buffer, width: number, height: number) =>
	sharp(input)
		.resize(width, height, { fit: 'fill', kernel: 'lanczos3' })
		.png()
		.toBuffer();

const cover = async (
	project: PlateProject,
	spec: Spec<'cover'>,
	surface: Surface
) => {
	const screen = await loadScreen(project, resolveScreen(spec.screen, surface));
	const box = centred(
		fit(screen, SAFE.width * COVER_WIDTH, SAFE.height * MAX_HEIGHT)
	);
	return {
		layers: [
			{
				input: await resized(screen.input, box.width, box.height),
				left: box.left,
				top: box.top,
			},
		],
		frames: [box],
	};
};

const detail = async (
	project: PlateProject,
	spec: Spec<'detail'>,
	surface: Surface
) => {
	const screen = await loadScreen(project, resolveScreen(spec.screen, surface));
	const { region, zoom = screen.dpr } = spec;
	const crop = {
		left: Math.round(region.x * screen.dpr),
		top: Math.round(region.y * screen.dpr),
		width: Math.round(region.width * screen.dpr),
		height: Math.round(region.height * screen.dpr),
	};
	if (
		crop.left + crop.width > screen.width ||
		crop.top + crop.height > screen.height
	) {
		throw new Error(
			`${project.slug}/${screen.name}: region outside the (trimmed) screen`
		);
	}
	const wanted = { width: region.width * zoom, height: region.height * zoom };
	const size = fit(
		wanted,
		Math.min(wanted.width, SAFE.width * 0.9),
		Math.min(wanted.height, SAFE.height * MAX_HEIGHT)
	);
	const upscale = size.width / crop.width;
	// Up to ~1.3× stays crisp at every rendered size; past that text visibly softens
	if (upscale > 1.3) {
		console.warn(
			`  ! ${project.slug}/${screen.name} detail upscales source ×${upscale.toFixed(2)}; capture at a higher DPR or lower the zoom`
		);
	}
	const box = centred(size);
	const input = await sharp(screen.input)
		.extract(crop)
		.resize(box.width, box.height, { fit: 'fill', kernel: 'lanczos3' })
		.png()
		.toBuffer();
	return { layers: [{ input, left: box.left, top: box.top }], frames: [box] };
};

const mobileTrio = async (project: PlateProject, spec: Spec<'mobile-trio'>) => {
	const screens = await Promise.all(
		spec.screens.map((name) => loadScreen(project, name))
	);
	const gap = Math.round(SAFE.width * 0.05);
	const height = Math.round(SAFE.height * 0.88);
	const widths = screens.map((s) => Math.round((s.width / s.height) * height));
	const total = widths.reduce((sum, w) => sum + w, 0) + gap * 2;
	const scale = Math.min(1, (SAFE.width * 0.9) / total);
	let left = Math.round((MASTER.width - total * scale) / 2);
	const boxes: Placed[] = widths.map((w) => {
		const box = {
			left,
			top: Math.round((MASTER.height - height * scale) / 2),
			width: Math.round(w * scale),
			height: Math.round(height * scale),
		};
		left += box.width + Math.round(gap * scale);
		return box;
	});
	const layers = await Promise.all(
		boxes.map(async (box, i) => ({
			input: await resized(screens[i].input, box.width, box.height),
			left: box.left,
			top: box.top,
		}))
	);
	return { layers, frames: boxes };
};

const UA =
	'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';

const loadGoogleFont = async (
	family: string,
	axes: string,
	text: string
): Promise<ArrayBuffer> => {
	const css = await (
		await fetch(
			`https://fonts.googleapis.com/css2?family=${family}:${axes}&text=${encodeURIComponent(text)}`,
			{ headers: { 'User-Agent': UA } }
		)
	).text();
	const url = css.match(
		/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
	)?.[1];
	if (!url) throw new Error(`Could not resolve ${family}`);
	return (await fetch(url)).arrayBuffer();
};

const MONO_ADVANCE = 0.6;

const codeLine = (
	line: string,
	variant: 'code' | 'terminal',
	colors: ReturnType<typeof surfaceColors>
): ReactElement => {
	const spans: ReactElement[] = [];
	let rest = line;
	if (variant === 'terminal' && rest.startsWith('$ ')) {
		spans.push(h('span', { key: 'p', style: { color: palette.orange } }, '$ '));
		rest = rest.slice(2);
	}
	const comment = rest.search(/(^|\s)(#|\/\/)/);
	const code = comment === -1 ? rest : rest.slice(0, comment);
	const note = comment === -1 ? '' : rest.slice(comment);
	if (code) spans.push(h('span', { key: 'c' }, code));
	if (note)
		spans.push(h('span', { key: 'n', style: { color: colors.muted } }, note));
	return h(
		'div',
		{ style: { display: 'flex', whiteSpace: 'pre', minHeight: '1.6em' } },
		...spans
	);
};

const typePlate = async (spec: Spec<'type-plate'>, surface: Surface) => {
	const colors = surfaceColors(surface);
	const label = spec.label ?? '';
	const rule = `1px solid ${hairline(surface, 2)}`;
	const labelStyle = {
		fontFamily: 'JetBrains Mono',
		fontSize: 40,
		letterSpacing: 2,
		textTransform: 'uppercase' as const,
		color: colors.muted,
	};

	let body: ReactElement;
	let fonts: { name: string; data: ArrayBuffer; style?: 'italic' | 'normal' }[];

	if (spec.variant === 'statement') {
		const words = spec.text.split(' ');
		const tail = words.pop() ?? '';
		fonts = [
			{
				name: 'Inter Tight',
				data: await loadGoogleFont('Inter+Tight', 'wght@500', spec.text),
			},
			{
				name: 'Instrument Serif',
				style: 'italic',
				data: await loadGoogleFont('Instrument+Serif', 'ital@1', tail),
			},
			{
				name: 'JetBrains Mono',
				data: await loadGoogleFont(
					'JetBrains+Mono',
					'wght@400',
					label.toUpperCase()
				),
			},
		];
		const fontSize = Math.min(
			168,
			Math.round(SAFE.width / Math.sqrt(spec.text.length * 6))
		);
		body = h(
			'div',
			{
				style: {
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					width: '100%',
					height: '100%',
				},
			},
			h(
				'div',
				{
					style: {
						...labelStyle,
						display: 'flex',
						paddingBottom: 32,
						borderBottom: rule,
					},
				},
				label
			),
			h(
				'div',
				{
					style: {
						display: 'flex',
						flexWrap: 'wrap',
						fontFamily: 'Inter Tight',
						fontSize,
						lineHeight: 1.04,
						letterSpacing: -fontSize * 0.03,
						color: colors.fg,
						maxWidth: SAFE.width * 0.86,
					},
				},
				`${words.join(' ')} `,
				h(
					'span',
					{
						style: {
							fontFamily: 'Instrument Serif',
							fontStyle: 'italic',
							color: palette.orange,
						},
					},
					tail
				)
			)
		);
	} else {
		const lines = spec.text.split('\n');
		const longest = Math.max(...lines.map((l) => l.length), 1);
		const fontSize = Math.floor(
			Math.min(
				64,
				(SAFE.width * 0.82) / (longest * MONO_ADVANCE),
				(SAFE.height * 0.66) / (lines.length * 1.6)
			)
		);
		fonts = [
			{
				name: 'JetBrains Mono',
				data: await loadGoogleFont(
					'JetBrains+Mono',
					'wght@400',
					`${spec.text}${label.toUpperCase()}`
				),
			},
		];
		body = h(
			'div',
			{
				style: {
					display: 'flex',
					flexDirection: 'column',
					margin: 'auto',
					border: rule,
					backgroundColor: colors.bg,
					fontFamily: 'JetBrains Mono',
				},
			},
			h(
				'div',
				{
					style: {
						...labelStyle,
						display: 'flex',
						padding: '28px 48px',
						borderBottom: rule,
					},
				},
				label
			),
			h(
				'div',
				{
					style: {
						display: 'flex',
						flexDirection: 'column',
						padding: 72,
						fontSize,
						lineHeight: 1.6,
						color: colors.fg,
					},
				},
				...lines.map((line) =>
					codeLine(line, spec.variant as 'code' | 'terminal', colors)
				)
			)
		);
	}

	const image = new ImageResponse(
		h(
			'div',
			{ style: { display: 'flex', width: '100%', height: '100%' } },
			body
		),
		{ width: SAFE.width, height: SAFE.height, fonts }
	);
	const input = Buffer.from(await image.arrayBuffer());
	return { layers: [{ input, left: SAFE_LEFT, top: SAFE_TOP }], frames: [] };
};

const GUIDES = [
	{ label: '21:9', ratio: 21 / 9 },
	{ label: '16:10', ratio: 16 / 10 },
	{ label: '4:3', ratio: 4 / 3 },
	{ label: '16:9', ratio: 16 / 9 },
];

const debugOverlay = (): string => {
	const accent = palette.orange;
	const guides = GUIDES.map(({ label, ratio }, i) => {
		const box = centred(visibleBox(ratio));
		const dash = i % 2 ? '24 12' : '';
		return `<rect x="${box.left + 2}" y="${box.top + 2}" width="${box.width - 4}" height="${box.height - 4}" fill="none" stroke="${accent}" stroke-width="4" stroke-dasharray="${dash}" />
<text x="${box.left + 24}" y="${box.top + 64 + i * 56}" fill="${accent}" font-family="JetBrains Mono, Menlo, monospace" font-size="44">${label}</text>`;
	}).join('');
	const safe = centred(SAFE);
	return `${guides}<rect x="${safe.left}" y="${safe.top}" width="${safe.width}" height="${safe.height}" fill="${rgba(accent, 0.08)}" stroke="${accent}" stroke-width="2" />
<text x="${safe.left + 24}" y="${safe.top + safe.height - 28}" fill="${accent}" font-family="JetBrains Mono, Menlo, monospace" font-size="44">safe ${SAFE.width}×${SAFE.height}</text>`;
};

const render = (project: PlateProject, spec: PlateSpec, surface: Surface) => {
	switch (spec.template) {
		case 'cover':
			return cover(project, spec, surface);
		case 'detail':
			return detail(project, spec, surface);
		case 'mobile-trio':
			return mobileTrio(project, spec);
		case 'type-plate':
			return typePlate(spec, surface);
	}
};

export const compose = async (selected: PlateProject[]): Promise<void> => {
	for (const project of selected) {
		const dir = resolve(OUT_DIR, project.slug);
		await mkdir(dir, { recursive: true });
		const manifest: PlateManifestEntry[] = [];

		const renders = project.plates.flatMap((spec) => {
			const surfaces = [spec.surface ?? project.surface ?? 'ink'].flat();
			return surfaces.map((surface) => ({
				spec,
				surface,
				variant: surfaces.length > 1,
			}));
		});

		for (const { spec, surface, variant } of renders) {
			const grid = spec.grid ?? project.grid ?? false;
			const name = plateName(project.slug, spec, variant ? surface : undefined);
			const { layers, frames } = await render(project, spec, surface);
			const below = grid ? [svg(gridLines(surface))] : [];
			const above = frames.length
				? [svg(frames.map((box) => frame(box, surface)).join(''))]
				: [];

			const plate = await sharp({
				create: {
					width: MASTER.width,
					height: MASTER.height,
					channels: 3,
					background: surfaceColors(surface).bg,
				},
			})
				.composite([...below, ...layers, ...above])
				.png({ compressionLevel: 9 })
				.toBuffer();

			await writeFile(resolve(dir, `${name}.png`), plate);
			await sharp(plate)
				.composite([svg(debugOverlay())])
				.png({ compressionLevel: 9 })
				.toFile(resolve(dir, `${name}.debug.png`));

			manifest.push({
				file: `${name}.png`,
				debug: `${name}.debug.png`,
				template: spec.template,
				alt: spec.alt,
				use: spec.use ?? [],
				surface,
				...(variant && { variant }),
			});
			console.log(`  composed ${project.slug}/${name}.png`);
		}

		await writeFile(
			resolve(dir, 'plates.json'),
			`${JSON.stringify(manifest, null, '\t')}\n`
		);
	}
};

if (import.meta.main) {
	await compose(selectProjects(projects));
}
