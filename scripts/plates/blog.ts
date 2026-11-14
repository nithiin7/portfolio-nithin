/**
 * Composes blog featured images: one 3840×2160 cover per post on ink and paper,
 * as PNG + WebP, with a .debug.png showing the blog crops (1:1, 4:3, 16:10,
 * 16:9, 21:9). The main figure sits in the centre square so the 1:1 index
 * thumbnail keeps it; labels stay inside the 4:3 ∩ 21:9 safe zone.
 *   pnpm plates:blog [slug…]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { ImageResponse } from 'next/og.js';
import { createElement as h, type ReactElement } from 'react';
import sharp from 'sharp';

import {
	centred,
	checkMark,
	gridLines,
	hairline,
	loadGoogleFont,
	panel,
	rgba,
	svg,
	windowBar,
} from './compose.ts';
import { MASTER, OUT_DIR, surfaceColors, type Surface } from './shared.ts';
import { visibleBox } from '../../src/config/imageCrops.ts';
import { palette } from '../../src/styles/tokens.ts';

export const BLOG_OUT_DIR = resolve(OUT_DIR, 'blog');

/**
 * The figure area. Its width is the centre square's, and the label rows and
 * caption share it, so the 1:1 index thumbnail never cuts text.
 */
const ART = { left: 840, top: 470, width: 2160, height: 1250 };
const FRAME_X = ART.left + 40;
const SURFACES: Surface[] = ['ink', 'paper'];
const WEBP_QUALITY = 88;

type Style = Record<string, string | number>;

interface Kit {
	surface: Surface;
	fg: string;
	muted: string;
	bg: string;
	rule: string;
	strong: string;
	tint: string;
	/** Queues SVG (in figure coordinates) drawn under the figure's boxes. */
	draw: (body: string) => ReactElement;
	drawn: string[];
}

export interface BlogCover {
	/** BlogPost.slug in Contentful. */
	slug: string;
	/** Mono kicker, top left. */
	label: string;
	/** Mono kicker, top right. */
	tag: string;
	/** Mono figure caption along the bottom rule. */
	caption: string;
	/** Asset description: what the figure shows, not the plate. */
	alt: string;
	art: (kit: Kit) => ReactElement;
}

const kit = (surface: Surface): Kit => {
	const { fg, muted, bg } = surfaceColors(surface);
	const drawn: string[] = [];
	return {
		drawn,
		draw: (body) => {
			drawn.push(body);
			return h('div', { style: { display: 'none' } });
		},
		surface,
		fg,
		muted,
		bg,
		rule: hairline(surface, 2.5),
		strong: hairline(surface, 5),
		tint: rgba(fg, 0.035),
	};
};

const abs = (
	left: number,
	top: number,
	width: number,
	height: number,
	style: Style,
	...children: (ReactElement | string)[]
): ReactElement =>
	h(
		'div',
		{
			style: {
				position: 'absolute',
				left,
				top,
				width,
				height,
				display: 'flex',
				...style,
			},
		},
		...children
	);

const text = (
	value: string,
	style: Style,
	key?: string | number
): ReactElement =>
	h('div', { key, style: { display: 'flex', ...style } }, value);

const mono = (value: string, size: number, color: string, extra: Style = {}) =>
	text(value, {
		fontFamily: 'JetBrains Mono',
		fontSize: size,
		color,
		...extra,
	});

const label = (value: string, color: string, size = 34) =>
	mono(value, size, color, { letterSpacing: 2, textTransform: 'uppercase' });

const display = (value: string, size: number, color: string) =>
	text(value, {
		fontFamily: 'Inter Tight',
		fontSize: size,
		lineHeight: 1.02,
		letterSpacing: -size * 0.03,
		color,
	});

const arrowHead = (x: number, y: number, angle: number, color: string) =>
	`<path d="M0 0 L-30 -14 L-30 14 Z" fill="${color}" transform="translate(${x} ${y}) rotate(${angle})" />`;

/** Mono line with a drawn check in place of ✓. */
const checkLine = (value: string, size: number, color: string) =>
	h(
		'div',
		{ style: { display: 'flex', alignItems: 'center', gap: 18 } },
		checkMark(size),
		mono(value, size, color)
	);

// 01 · Local AI resume builder: the resume and the model inside a localhost boundary.
const resumeArt = (k: Kit): ReactElement => {
	const bar = (width: number, color: string, height = 18) =>
		h('div', {
			style: { display: 'flex', width, height, backgroundColor: color },
		});
	const faint = rgba(k.fg, k.surface === 'ink' ? 0.22 : 0.18);
	const section = (name: string, widths: number[], accent?: number) =>
		h(
			'div',
			{ style: { display: 'flex', flexDirection: 'column', gap: 22 } },
			label(name, k.muted, 28),
			...widths.map((w, i) =>
				h(
					'div',
					{ key: i, style: { display: 'flex', alignItems: 'center', gap: 14 } },
					bar(w, i === accent ? palette.orange : faint),
					i === accent
						? h('div', {
								style: {
									display: 'flex',
									width: 4,
									height: 40,
									backgroundColor: palette.orange,
								},
							})
						: ''
				)
			)
		);

	const sheet = abs(
		170,
		210,
		760,
		900,
		{
			...panel(k.surface),
			padding: '64px 64px',
			gap: 48,
			backgroundColor:
				k.surface === 'ink' ? rgba(k.fg, 0.05) : rgba('#ffffff', 0.55),
		},
		h(
			'div',
			{ style: { display: 'flex', flexDirection: 'column', gap: 20 } },
			bar(380, k.fg, 44),
			bar(240, k.muted, 20)
		),
		h('div', {
			style: { display: 'flex', height: 1, backgroundColor: k.strong },
		}),
		section('Experience', [560, 600, 520], 1),
		section('Projects', [600, 480]),
		section('Skills', [420])
	);

	const model = abs(
		1220,
		330,
		800,
		640,
		{ ...panel(k.surface), backgroundColor: k.bg },
		windowBar('ollama · llama3.1:8b', k.surface),
		h(
			'div',
			{
				style: {
					display: 'flex',
					flexDirection: 'column',
					gap: 34,
					padding: '52px 48px',
				},
			},
			h(
				'div',
				{ style: { display: 'flex' } },
				mono('$', 40, palette.orange, { marginRight: 24 }),
				mono('ollama serve', 40, k.fg)
			),
			mono('→ rewrite experience 02', 40, k.muted),
			mono('→ match to job post', 40, k.muted),
			checkLine('ready in 1.4 s', 40, k.fg),
			h('div', {
				style: { display: 'flex', height: 1, backgroundColor: k.rule },
			}),
			h(
				'div',
				{ style: { display: 'flex', justifyContent: 'space-between' } },
				mono('network', 40, k.muted),
				mono('0 bytes out', 40, palette.orange)
			)
		)
	);

	return h(
		'div',
		{
			style: {
				display: 'flex',
				position: 'relative',
				width: ART.width,
				height: ART.height,
			},
		},
		k.draw(
			`<rect x="40" y="70" width="${ART.width - 80}" height="${ART.height - 120}" fill="none" stroke="${k.strong}" stroke-width="4" stroke-dasharray="22 16" />
			<line x1="940" y1="560" x2="1200" y2="560" stroke="${k.strong}" stroke-width="4" />${arrowHead(1210, 560, 0, k.strong)}
			<line x1="1210" y1="760" x2="950" y2="760" stroke="${palette.orange}" stroke-width="4" />${arrowHead(940, 760, 180, palette.orange)}`
		),
		abs(
			100,
			40,
			520,
			60,
			{ alignItems: 'center', justifyContent: 'center', backgroundColor: k.bg },
			label('localhost:11434', k.fg, 36)
		),
		abs(
			960,
			490,
			240,
			50,
			{ justifyContent: 'center' },
			label('prompt', k.muted, 28)
		),
		abs(
			960,
			790,
			240,
			50,
			{ justifyContent: 'center' },
			label('rewrite', palette.orange, 28)
		),
		sheet,
		model
	);
};

// 02 · Frontend performance: a cold-load network waterfall with the LCP marker.
const PERF_ROWS: [name: string, start: number, duration: number][] = [
	['document', 0, 0.26],
	['styles.css', 0.26, 0.14],
	['inter-tight.woff2', 0.28, 0.2],
	['hero.avif', 0.3, 0.46],
	['app.js', 0.42, 0.38],
	['analytics.js', 1.3, 0.34],
];
const LCP_AT = 0.78;

const perfArt = (k: Kit): ReactElement => {
	const track = { left: 700, width: 1340 };
	const seconds = 2;
	const x = (t: number) => track.left + (t / seconds) * track.width;
	const rowTop = 300;
	const rowHeight = 104;
	const lcpRow = PERF_ROWS.findIndex(([name]) => name === 'hero.avif');
	const lazy = PERF_ROWS.length - 1;

	const ticks = [0, 0.5, 1, 1.5, 2]
		.map(
			(t) =>
				`<line x1="${x(t)}" y1="230" x2="${x(t)}" y2="${rowTop + PERF_ROWS.length * rowHeight}" stroke="${k.rule}" stroke-width="2" />`
		)
		.join('');
	const bars = PERF_ROWS.map(([, start, duration], i) => {
		const y = rowTop + i * rowHeight + 30;
		const width = (duration / seconds) * track.width;
		if (i === lazy)
			return `<rect x="${x(start)}" y="${y}" width="${width}" height="44" fill="none" stroke="${k.muted}" stroke-width="3" stroke-dasharray="12 10" />`;
		const fill =
			i === lcpRow
				? palette.orange
				: rgba(k.fg, k.surface === 'ink' ? 0.42 : 0.32);
		return `<rect x="${x(start)}" y="${y}" width="${width}" height="44" fill="${fill}" />`;
	}).join('');
	const lcpX = x(LCP_AT);
	const tableBottom = rowTop + PERF_ROWS.length * rowHeight;

	const vital = (name: string, value: string, unit: string) =>
		h(
			'div',
			{
				style: {
					display: 'flex',
					flexDirection: 'column',
					gap: 16,
					width: 560,
				},
			},
			h(
				'div',
				{ style: { display: 'flex', alignItems: 'center', gap: 16 } },
				label(name, k.muted, 32),
				checkMark(36)
			),
			h(
				'div',
				{ style: { display: 'flex', alignItems: 'flex-end', gap: 14 } },
				display(value, 120, k.fg),
				mono(unit, 44, k.muted, { paddingBottom: 14 })
			)
		);

	return h(
		'div',
		{
			style: {
				display: 'flex',
				position: 'relative',
				width: ART.width,
				height: ART.height,
			},
		},
		abs(
			0,
			30,
			ART.width,
			ART.height - 40,
			panel(k.surface),
			windowBar('network · cold load · fast 4g', k.surface)
		),
		k.draw(
			`${ticks}${bars}
			<line x1="${lcpX}" y1="200" x2="${lcpX}" y2="${tableBottom + 10}" stroke="${palette.orange}" stroke-width="4" />
			<line x1="60" y1="${tableBottom + 40}" x2="${ART.width - 60}" y2="${tableBottom + 40}" stroke="${k.rule}" stroke-width="2" />`
		),
		...[0, 0.5, 1, 1.5, 2].map((t) =>
			abs(
				x(t) - 100,
				236,
				200,
				40,
				{ justifyContent: 'center' },
				mono(t === 0 ? '0' : `${t}s`, 30, k.muted)
			)
		),
		abs(lcpX + 20, 186, 400, 50, {}, label('LCP 0.78 s', palette.orange, 32)),
		...PERF_ROWS.map(([name], i) =>
			abs(
				70,
				rowTop + i * rowHeight + 28,
				600,
				50,
				{ alignItems: 'center' },
				mono(
					name,
					38,
					i === lcpRow ? palette.orange : i === lazy ? k.muted : k.fg
				)
			)
		),
		abs(
			70,
			tableBottom + 90,
			ART.width - 140,
			220,
			{ justifyContent: 'space-between' },
			vital('Largest paint', '0.78', 's'),
			vital('Interaction', '64', 'ms'),
			vital('Layout shift', '0.01', '')
		)
	);
};

// 03 · MCP: one host, one protocol, many servers.
const MCP_SERVERS: [name: string, kind: string, call: string][] = [
	['Filesystem', 'resources', 'resources/read'],
	['Postgres', 'tools', 'tools/list'],
	['GitHub', 'tools', 'tools/call'],
];

const mcpArt = (k: Kit): ReactElement => {
	const card = (
		left: number,
		top: number,
		width: number,
		height: number,
		kicker: string,
		name: string,
		foot: string,
		accent = false
	) =>
		abs(
			left,
			top,
			width,
			height,
			{
				...panel(k.surface),
				backgroundColor: k.bg,
				padding: '40px 44px',
				justifyContent: 'space-between',
				...(accent && { border: `4px solid ${palette.orange}` }),
			},
			label(kicker, accent ? palette.orange : k.muted, 30),
			display(name, 76, k.fg),
			mono(foot, 32, k.muted)
		);

	const hub = { left: 800, top: 440, width: 560, height: 370 };
	const hubMid = hub.top + hub.height / 2;
	const server = { left: 1600, width: 560, height: 280, tops: [100, 485, 870] };
	const active = MCP_SERVERS.length - 1;

	const fan = server.tops
		.map((top, i) => {
			const y = top + server.height / 2;
			const color = i === active ? palette.orange : k.strong;
			const startY = hubMid + (i - 1) * 90;
			return `<path d="M${hub.left + hub.width} ${startY} H1460 V${y} H${server.left - 10}" fill="none" stroke="${color}" stroke-width="4" />${arrowHead(server.left, y, 0, color)}`;
		})
		.join('');

	return h(
		'div',
		{
			style: {
				display: 'flex',
				position: 'relative',
				width: ART.width,
				height: ART.height,
			},
		},
		k.draw(
			`<line x1="560" y1="${hubMid}" x2="${hub.left - 10}" y2="${hubMid}" stroke="${k.strong}" stroke-width="4" />${arrowHead(hub.left, hubMid, 0, k.strong)}${fan}`
		),
		card(
			0,
			hubMid - 220,
			560,
			440,
			'Host · client',
			'Claude',
			'one connection'
		),
		abs(
			600,
			hubMid - 70,
			180,
			50,
			{ justifyContent: 'center' },
			label('stdio', k.muted, 28)
		),
		abs(
			hub.left,
			hub.top,
			hub.width,
			hub.height,
			{
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 18,
				border: `6px solid ${palette.orange}`,
				backgroundColor:
					k.surface === 'ink'
						? rgba(palette.orange, 0.1)
						: rgba(palette.orange, 0.07),
			},
			display('MCP', 190, k.fg),
			label('json-rpc 2.0', palette.orange, 34)
		),
		...MCP_SERVERS.map(([name, kind, call], i) =>
			card(
				server.left,
				server.tops[i] ?? 0,
				server.width,
				server.height,
				`Server · ${kind}`,
				name,
				call,
				i === active
			)
		)
	);
};

// 04 · Agentic AI: the plan → act → observe → reflect loop around a goal.
const LOOP: [name: string, angle: number][] = [
	['Plan', -90],
	['Act', 0],
	['Observe', 90],
	['Reflect', 180],
];

const agenticArt = (k: Kit): ReactElement => {
	const cx = 900;
	const cy = 640;
	const r = 480;
	const node = { width: 380, height: 150 };
	const activeIndex = 1;
	const point = (angle: number, radius = r) => {
		const rad = (angle * Math.PI) / 180;
		return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
	};
	const arrows = [-45, 45, 135, 225]
		.map((angle) => {
			const p = point(angle);
			const color = angle === -45 ? palette.orange : k.strong;
			return arrowHead(p.x, p.y, angle + 90, color);
		})
		.join('');
	const plan = point(-90);
	const act = point(0);
	const activeArc = `<path d="M${plan.x} ${plan.y} A${r} ${r} 0 0 1 ${act.x} ${act.y}" fill="none" stroke="${palette.orange}" stroke-width="6" />`;

	return h(
		'div',
		{
			style: {
				display: 'flex',
				position: 'relative',
				width: ART.width,
				height: ART.height,
			},
		},
		k.draw(
			`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${k.strong}" stroke-width="4" />${activeArc}${arrows}
			<line x1="${act.x + node.width / 2}" y1="${act.y}" x2="1640" y2="${act.y}" stroke="${palette.orange}" stroke-width="4" stroke-dasharray="14 10" />`
		),
		abs(
			cx - 270,
			cy - 180,
			540,
			360,
			{
				...panel(k.surface),
				backgroundColor: k.bg,
				padding: '48px 52px',
				justifyContent: 'space-between',
			},
			h(
				'div',
				{ style: { display: 'flex', justifyContent: 'space-between' } },
				label('Goal', k.muted, 28),
				label('step 04/09', palette.orange, 28)
			),
			display('Ship the weekly report', 64, k.fg),
			mono('until: checks pass', 34, k.muted)
		),
		...LOOP.map(([name, angle], i) => {
			const p = point(angle);
			const on = i === activeIndex;
			return abs(
				p.x - node.width / 2,
				p.y - node.height / 2,
				node.width,
				node.height,
				{
					flexDirection: 'column',
					justifyContent: 'center',
					gap: 10,
					padding: '0 40px',
					backgroundColor: k.bg,
					// Opaque: the loop's circle runs behind the node.
					...(on && {
						backgroundImage: `linear-gradient(${rgba(palette.orange, 0.12)}, ${rgba(palette.orange, 0.12)})`,
					}),
					border: on ? `5px solid ${palette.orange}` : `3px solid ${k.strong}`,
				},
				label(`0${i + 1}`, on ? palette.orange : k.muted, 28),
				display(name, 64, k.fg)
			);
		}),
		abs(
			1640,
			act.y - 170,
			520,
			340,
			{
				...panel(k.surface),
				backgroundColor: k.bg,
				flexDirection: 'column',
				padding: '36px 40px',
				gap: 24,
			},
			label('Tool call', palette.orange, 28),
			mono('run_query(', 36, k.fg),
			mono('  "weekly_kpis"', 36, k.muted),
			mono(')', 36, k.fg),
			checkLine('42 rows', 36, k.fg)
		)
	);
};

// 05 · Orbit: ten apps as modules on three orbits around one self-hosted core.
const ORBITS = [
	{ rx: 380, ry: 230 },
	{ rx: 620, ry: 380 },
	{ rx: 880, ry: 520 },
];
const MODULES: [name: string, orbit: number, angle: number][] = [
	['Tasks', 0, 205],
	['Calendar', 0, 25],
	['Finance', 1, -40],
	['Notes', 1, 140],
	['Habits', 1, -125],
	['Documents', 2, -15],
	['Health', 2, 60],
	['Watchlist', 2, 165],
	['Saved', 2, -100],
	['Places', 2, 110],
];

const orbitArt = (k: Kit): ReactElement => {
	const cx = ART.width / 2;
	const cy = 625;
	const core = 160;
	const at = (orbit: number, angle: number) => {
		const { rx, ry } = ORBITS[orbit] ?? { rx: 0, ry: 0 };
		const rad = (angle * Math.PI) / 180;
		return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) };
	};
	const rings = ORBITS.map(
		({ rx, ry }, i) =>
			`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${k.strong}" stroke-width="${i === 2 ? 3 : 4}"${i === 2 ? ' stroke-dasharray="18 14"' : ''} />`
	).join('');

	return h(
		'div',
		{
			style: {
				display: 'flex',
				position: 'relative',
				width: ART.width,
				height: ART.height,
			},
		},
		k.draw(
			`${rings}<circle cx="${cx}" cy="${cy}" r="${core}" fill="${palette.orange}" />`
		),
		abs(
			cx - core,
			cy - core,
			core * 2,
			core * 2,
			{
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 10,
			},
			display('Orbit', 84, palette.ink),
			label('your server', palette.ink, 26)
		),
		...MODULES.map(([name, orbit, angle]) => {
			const p = at(orbit, angle);
			return abs(
				p.x - 200,
				p.y - 40,
				400,
				80,
				{ justifyContent: 'center', alignItems: 'center' },
				h(
					'div',
					{
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							padding: '0 30px',
							height: 80,
							border: `3px solid ${k.strong}`,
							backgroundColor: k.bg,
						},
					},
					h('div', {
						style: {
							display: 'flex',
							width: 14,
							height: 14,
							borderRadius: 7,
							backgroundColor: k.fg,
						},
					}),
					label(name, k.fg, 34)
				)
			);
		})
	);
};

export const BLOG_COVERS: BlogCover[] = [
	{
		slug: 'free-local-ai-resume-builder',
		label: 'Field notes · Local AI',
		tag: 'Ollama · open-source LLMs',
		caption:
			'Fig. — the resume, the model and your data never leave localhost.',
		alt: 'A resume beside a local Ollama model inside a localhost boundary: prompts go in, rewrites come back, zero bytes leave the machine.',
		art: resumeArt,
	},
	{
		slug: 'frontend-performance-techniques',
		label: 'Field notes · Performance',
		tag: 'LCP · INP · CLS',
		caption:
			'Fig. — the hero image decides LCP; everything else gets out of its way.',
		alt: 'Network waterfall of a cold page load with the hero image marking LCP at 0.78 s, deferred analytics, and passing LCP, INP and CLS readouts.',
		art: perfArt,
	},
	{
		slug: 'what-is-mcp-model-context-protocol',
		label: 'Field notes · Protocols',
		tag: 'Model Context Protocol',
		caption: 'Fig. — one client, one protocol, any number of servers.',
		alt: 'Diagram of MCP: a Claude host connects through the protocol hub to filesystem, Postgres and GitHub servers via resources and tool calls.',
		art: mcpArt,
	},
	{
		slug: 'what-is-agentic-ai',
		label: 'Field notes · Agents',
		tag: 'Plan · act · observe · reflect',
		caption:
			'Fig. — an agent loops until the goal is met, not until the reply ends.',
		alt: 'The agent loop: plan, act, observe and reflect circling a goal, with the act step running a tool call that returns 42 rows.',
		art: agenticArt,
	},
	{
		slug: 'meet-orbit-self-hosted-assistant',
		label: 'Field notes · Self-hosting',
		tag: 'Open source · Apache 2.0',
		caption: 'Fig. — ten apps in one orbit, on a server you own.',
		alt: 'Orbit at the centre of three orbits carrying its modules: tasks, calendar, finance, notes, habits, documents, health, watchlist, saved and places.',
		art: orbitArt,
	},
];

const GLYPHS = `${Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('')}→←·—…`;

const fonts = async () => [
	{
		name: 'Inter Tight',
		data: await loadGoogleFont('Inter+Tight', 'wght@500', GLYPHS),
	},
	{
		name: 'JetBrains Mono',
		data: await loadGoogleFont('JetBrains+Mono', 'wght@400', GLYPHS),
	},
];

const frameRow = (k: Kit, left: string, right: string, top: number) =>
	abs(
		FRAME_X,
		top,
		MASTER.width - FRAME_X * 2,
		60,
		{ justifyContent: 'space-between', alignItems: 'center' },
		label(left, k.muted, 40),
		label(right, k.muted, 40)
	);

const BLOG_GUIDES = [
	{ label: '21:9 post', ratio: 21 / 9 },
	{ label: '16:10 featured', ratio: 16 / 10 },
	{ label: '4:3 thumb', ratio: 4 / 3 },
	{ label: '1:1 thumb', ratio: 1 },
];

const debugOverlay = (): string =>
	BLOG_GUIDES.map(({ label: name, ratio }, i) => {
		const box = centred(visibleBox(ratio));
		return `<rect x="${box.left + 2}" y="${box.top + 2}" width="${box.width - 4}" height="${box.height - 4}" fill="none" stroke="${palette.orange}" stroke-width="4" stroke-dasharray="${i % 2 ? '24 12' : ''}" />
<text x="${box.left + 24}" y="${box.top + 64 + i * 56}" fill="${palette.orange}" font-family="Menlo, monospace" font-size="44">${name}</text>`;
	}).join('');

const renderCover = async (
	cover: BlogCover,
	surface: Surface,
	loaded: Awaited<ReturnType<typeof fonts>>
) => {
	const k = kit(surface);
	const top = 300;
	const bottom = 1790;
	const image = new ImageResponse(
		h(
			'div',
			{
				style: {
					display: 'flex',
					position: 'relative',
					width: '100%',
					height: '100%',
					fontFamily: 'JetBrains Mono',
				},
			},
			frameRow(k, cover.label, cover.tag, top),
			abs(FRAME_X, top + 84, MASTER.width - FRAME_X * 2, 2, {
				backgroundColor: k.rule,
			}),
			abs(ART.left, ART.top, ART.width, ART.height, {}, cover.art(k)),
			abs(FRAME_X, bottom - 24, MASTER.width - FRAME_X * 2, 2, {
				backgroundColor: k.rule,
			}),
			abs(
				FRAME_X,
				bottom,
				MASTER.width - FRAME_X * 2,
				60,
				{ alignItems: 'center' },
				mono(cover.caption, 38, k.muted)
			)
		),
		{ width: MASTER.width, height: MASTER.height, fonts: loaded }
	);
	const layer = Buffer.from(await image.arrayBuffer());
	return sharp({
		create: { ...MASTER, channels: 3, background: k.bg },
	})
		.composite([
			svg(gridLines(surface)),
			svg(
				`<g transform="translate(${ART.left} ${ART.top})" shape-rendering="geometricPrecision">${k.drawn.join('')}</g>`
			),
			{ input: layer, left: 0, top: 0 },
		])
		.png({ compressionLevel: 9 })
		.toBuffer();
};

/** Asset stem for a post's cover on one surface. */
export const blogCoverName = (slug: string, surface: Surface): string =>
	`post-${slug}--featured-${surface}`;

const composeBlog = async (covers: BlogCover[]): Promise<void> => {
	const loaded = await fonts();
	for (const cover of covers) {
		const dir = resolve(BLOG_OUT_DIR, cover.slug);
		await mkdir(dir, { recursive: true });
		for (const surface of SURFACES) {
			const name = blogCoverName(cover.slug, surface);
			const png = await renderCover(cover, surface, loaded);
			await writeFile(resolve(dir, `${name}.png`), png);
			const webp = await sharp(png)
				.webp({ quality: WEBP_QUALITY, effort: 6 })
				.toBuffer();
			await writeFile(resolve(dir, `${name}.webp`), webp);
			await sharp(png)
				.composite([svg(debugOverlay())])
				.png({ compressionLevel: 9 })
				.toFile(resolve(dir, `${name}.debug.png`));
			console.log(
				`  ${cover.slug}/${name}.webp  ${Math.round(webp.length / 1024)} KB`
			);
		}
	}
};

/** Picks covers named on the CLI, or all of them. */
export const selectCovers = (
	args: string[] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
): BlogCover[] => {
	if (args.length === 0) return BLOG_COVERS;
	const unknown = args.filter((a) => !BLOG_COVERS.some((c) => c.slug === a));
	if (unknown.length) throw new Error(`Unknown post(s): ${unknown.join(', ')}`);
	return BLOG_COVERS.filter((c) => args.includes(c.slug));
};

if (import.meta.main) {
	await composeBlog(selectCovers());
}
