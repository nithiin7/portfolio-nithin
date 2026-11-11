import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { duration, ease, palette } from './tokens';

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

	it('easing', () => {
		expect(scss).toContain(`--ease: cubic-bezier(${ease.join(', ')});`);
	});

	it('durations', () => {
		expect(scss).toContain(`--dur-1: ${duration.fast}s;`);
		expect(scss).toContain(`--dur-2: ${duration.base}s;`);
		expect(scss).toContain(`--dur-3: ${duration.slow}s;`);
	});
});
