import { describe, expect, it } from 'vitest';

import { resolveSchedule, scrambleFrame, toChars } from './scramble';

const sequence = (...values: number[]) => {
	let i = 0;
	return () => values[i++ % values.length] ?? 0;
};

describe('resolveSchedule', () => {
	it('resolves left to right without jitter', () => {
		expect(resolveSchedule('abcd', 0)).toEqual([0.25, 0.5, 0.75, 1]);
	});

	it('never scrambles whitespace and ranks only visible characters', () => {
		expect(resolveSchedule('a b', 0)).toEqual([0.5, 0, 1]);
	});

	it('keeps every character within 0–1 whatever the jitter', () => {
		const schedule = resolveSchedule('Selected works.', 0.6, sequence(0.99, 0));
		for (const at of schedule) {
			expect(at).toBeGreaterThanOrEqual(0);
			expect(at).toBeLessThanOrEqual(1);
		}
	});

	it('jitter only nudges, so order stays roughly left to right', () => {
		const schedule = resolveSchedule('abcdefghij', 0.3, Math.random);
		const firstHalf = Math.max(...schedule.slice(0, 3));
		const lastHalf = Math.min(...schedule.slice(-3));
		expect(firstHalf).toBeLessThan(lastHalf);
	});

	it('treats astral characters as one', () => {
		expect(toChars('a😀b')).toHaveLength(3);
		expect(resolveSchedule('a😀b', 0)).toHaveLength(3);
	});
});

describe('scrambleFrame', () => {
	const schedule = resolveSchedule('abcd', 0);

	it('shows glyphs everywhere at 0 and the final text at 1', () => {
		expect(scrambleFrame(schedule, 0, 'X').every((g) => g === 'X')).toBe(true);
		expect(scrambleFrame(schedule, 1, 'X').every((g) => g === null)).toBe(true);
	});

	it('resolves the characters whose time has come', () => {
		expect(scrambleFrame(schedule, 0.5, 'X')).toEqual([null, null, 'X', 'X']);
	});

	it('picks glyphs from the set', () => {
		const frame = scrambleFrame(schedule, 0, 'AB', sequence(0, 0.6));
		expect(frame).toEqual(['A', 'B', 'A', 'B']);
	});

	it('leaves whitespace alone at any progress', () => {
		expect(scrambleFrame(resolveSchedule('a b', 0), 0, 'X')).toEqual([
			'X',
			null,
			'X',
		]);
	});
});
