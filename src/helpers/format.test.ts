import { afterEach, describe, expect, it, vi } from 'vitest';

import { calendarDay, formatCompactNumber, formatDate } from 'helpers/format';

describe('formatDate', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('formats long dates', () => {
		expect(formatDate('2026-03-15', 'long')).toBe('March 15, 2026');
	});

	it('formats short dates', () => {
		expect(formatDate('2026-03-15', 'short')).toBe('Mar 15, 2026');
	});

	it('keeps the written day for Contentful dates at a local midnight', () => {
		expect(formatDate('2026-11-11T00:00:00.000+05:30', 'long')).toBe(
			'November 11, 2026'
		);
	});

	it('formats relative dates', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-15T12:00:00Z'));

		expect(formatDate('2026-03-15T10:00:00Z', 'relative')).toBe('Today');
		expect(formatDate('2026-03-14T12:00:00Z', 'relative')).toBe('Yesterday');
		expect(formatDate('2026-03-12T12:00:00Z', 'relative')).toBe('3 days ago');
		expect(formatDate('2026-03-01T12:00:00Z', 'relative')).toBe('2 weeks ago');
		expect(formatDate('2026-01-10T12:00:00Z', 'relative')).toBe('2 months ago');
		expect(formatDate('2024-03-01T12:00:00Z', 'relative')).toBe('2 years ago');
	});
});

describe('calendarDay', () => {
	it('is UTC midnight of the date as written', () => {
		expect(calendarDay('2026-11-11T00:00:00.000+05:30').toISOString()).toBe(
			'2026-11-11T00:00:00.000Z'
		);
		expect(calendarDay('2025-01-01T00:00:00.000Z').toISOString()).toBe(
			'2025-01-01T00:00:00.000Z'
		);
	});

	it('falls back to Date parsing for other formats', () => {
		expect(Number.isNaN(calendarDay('nope').getTime())).toBe(true);
	});
});

describe('formatCompactNumber', () => {
	it('keeps small numbers whole', () => {
		expect(formatCompactNumber(999)).toBe('999');
	});

	it('abbreviates thousands and millions to one decimal', () => {
		expect(formatCompactNumber(1284)).toBe('1.3K');
		expect(formatCompactNumber(2_500_000)).toBe('2.5M');
	});
});
