// Regenerates the favicon / touch / manifest icons from the design tokens.
// Run with `pnpm icons` after changing the palette; outputs are committed.
import { writeFile } from 'node:fs/promises';

import { ImageResponse } from 'next/og.js';
import { createElement as h } from 'react';

import { palette } from '../src/styles/tokens.ts';

const UA =
	'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';

const loadFont = async (): Promise<ArrayBuffer> => {
	const css = await (
		await fetch(
			'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600&text=NP',
			{ headers: { 'User-Agent': UA } }
		)
	).text();
	const url = css.match(
		/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
	)?.[1];
	if (!url) throw new Error('Could not resolve Inter Tight');
	return (await fetch(url)).arrayBuffer();
};

/** `scale` is the glyph block's share of the canvas; maskable icons need ≤ 0.8. */
const render = async (
	size: number,
	font: ArrayBuffer,
	scale = 1
): Promise<Buffer> => {
	const fontSize = size * 0.5 * scale;
	const dot = Math.max(2, Math.round(size * 0.09 * scale));
	const image = new ImageResponse(
		h(
			'div',
			{
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: palette.ink,
				},
			},
			h(
				'div',
				{ style: { display: 'flex', alignItems: 'flex-end' } },
				h(
					'div',
					{
						style: {
							display: 'flex',
							fontFamily: 'Inter Tight',
							fontWeight: 600,
							fontSize,
							lineHeight: 1,
							letterSpacing: -fontSize * 0.06,
							color: palette.paper,
						},
					},
					'NP'
				),
				h('div', {
					style: {
						width: dot,
						height: dot,
						marginLeft: dot * 0.4,
						marginBottom: fontSize * 0.14,
						backgroundColor: palette.orange,
					},
				})
			)
		),
		{
			width: size,
			height: size,
			fonts: [{ name: 'Inter Tight', data: font, weight: 600 }],
		}
	);
	return Buffer.from(await image.arrayBuffer());
};

/** ICO container holding PNG payloads (supported by every current browser). */
const toIco = (pngs: { size: number; data: Buffer }[]): Buffer => {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(pngs.length, 4);
	let offset = 6 + pngs.length * 16;
	const entries = pngs.map(({ size, data }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size >= 256 ? 0 : size, 0);
		entry.writeUInt8(size >= 256 ? 0 : size, 1);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += data.length;
		return entry;
	});
	return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
};

const font = await loadFont();

const ico = await Promise.all(
	[16, 32, 48].map(async (size) => ({ size, data: await render(size, font) }))
);
await writeFile('src/app/favicon.ico', toIco(ico));
await writeFile('src/app/icon.png', await render(192, font));
await writeFile('src/app/apple-icon.png', await render(180, font, 0.9));
await writeFile('public/icons/icon-192.png', await render(192, font));
await writeFile('public/icons/icon-512.png', await render(512, font));
await writeFile(
	'public/icons/icon-maskable-512.png',
	await render(512, font, 0.72)
);

console.log('Icons written.');
