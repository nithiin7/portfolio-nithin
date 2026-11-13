import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { duration, ease, lineAlpha, palette } from './tokens';

const scss = readFileSync(
	resolve(process.cwd(), 'src/styles/tokens.scss'),
	'utf8'
);

describe('tokens.ts mirrors tokens.scss', () => {
	it('palette', () => {
		expect(scss).toContain(`$ink: ${palette.ink};`);
		expect(scss).toContain(`$paper: ${palette.paper};`);
		expect(scss).toContain(`$grey-500: ${palette.grey500};`);
		expect(scss).toContain(`$orange: ${palette.orange};`);
	});

	it('line alpha', () => {
		const rgb = (hex: string) =>
			[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
		expect(scss).toContain(
			`--line: rgb(${rgb(palette.paper)} / ${Math.round(lineAlpha.onInk * 100)}%);`
		);
		expect(scss).toContain(
			`--line: rgb(${rgb(palette.ink)} / ${Math.round(lineAlpha.onPaper * 100)}%);`
		);
	});

	it('easing', () => {
		expect(scss).toContain(`--ease: cubic-bezier(${ease.join(', ')});`);
	});

	it('durations', () => {
		expect(scss).toContain(`--dur-1: ${duration.fast}s;`);
		expect(scss).toContain(`--dur-2: ${duration.base}s;`);
		expect(scss).toContain(`--dur-3: ${duration.slow}s;`);
	});
});
