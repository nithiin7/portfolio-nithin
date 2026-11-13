import { describe, expect, it } from 'vitest';

import { manifestoFrame } from './sequence';

describe('manifestoFrame', () => {
	it('opens on the first word, settled', () => {
		expect(manifestoFrame(0, 5)).toEqual({ index: 0, resolve: 1 });
	});

	it('ends on the last word, settled before the pin releases', () => {
		expect(manifestoFrame(1, 5)).toEqual({ index: 4, resolve: 1 });
		expect(manifestoFrame(0.9, 5)).toEqual({ index: 4, resolve: 1 });
	});

	it('dissolves the outgoing word, then resolves the next around a boundary', () => {
		const before = manifestoFrame(0.19, 5);
		expect(before.index).toBe(0);
		expect(before.resolve).toBeCloseTo(0.05 / 0.3);

		expect(manifestoFrame(0.2, 5)).toEqual({ index: 1, resolve: 0 });

		const after = manifestoFrame(0.23, 5);
		expect(after.index).toBe(1);
		expect(after.resolve).toBeCloseTo(0.15 / 0.3);
	});

	it('holds each word settled mid-slot', () => {
		expect(manifestoFrame(0.3, 5)).toEqual({ index: 1, resolve: 1 });
		expect(manifestoFrame(0.5, 5)).toEqual({ index: 2, resolve: 1 });
	});

	it('visits every word in order', () => {
		const seen = new Set<number>();
		for (let p = 0; p <= 1; p += 0.01) seen.add(manifestoFrame(p, 5).index);
		expect([...seen]).toEqual([0, 1, 2, 3, 4]);
	});

	it('clamps out-of-range progress and handles a single word', () => {
		expect(manifestoFrame(-1, 3)).toEqual({ index: 0, resolve: 1 });
		expect(manifestoFrame(2, 3)).toEqual({ index: 2, resolve: 1 });
		expect(manifestoFrame(0.5, 1)).toEqual({ index: 0, resolve: 1 });
	});
});
