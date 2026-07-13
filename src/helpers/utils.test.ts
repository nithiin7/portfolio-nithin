import { afterEach, describe, expect, it, vi } from 'vitest';

import {
	calculateReadTime,
	formatDate,
	generateExcerpt,
	getImageUrl,
	parseCommaSeparatedString,
	slugify,
} from 'helpers/index';

describe('parseCommaSeparatedString', () => {
	it('splits and trims comma-separated values', () => {
		expect(parseCommaSeparatedString('React, Next.js , TypeScript')).toEqual([
			'React',
			'Next.js',
			'TypeScript',
		]);
	});

	it('strips single quotes', () => {
		expect(parseCommaSeparatedString("'React','GraphQL'")).toEqual([
			'React',
			'GraphQL',
		]);
	});

	it('drops empty segments', () => {
		expect(parseCommaSeparatedString('a,,b, ,c')).toEqual(['a', 'b', 'c']);
	});

	it('returns an empty array for empty input', () => {
		expect(parseCommaSeparatedString('')).toEqual([]);
	});
});

describe('calculateReadTime', () => {
	it('rounds up to whole minutes', () => {
		const words = Array(250).fill('word').join(' ');

		expect(calculateReadTime(words)).toBe(2);
	});

	it('returns at least 1 minute for short content', () => {
		expect(calculateReadTime('just a few words')).toBe(1);
	});

	it('respects a custom reading speed', () => {
		const words = Array(300).fill('word').join(' ');

		expect(calculateReadTime(words, 100)).toBe(3);
	});
});

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

describe('generateExcerpt', () => {
	it('strips HTML tags', () => {
		expect(generateExcerpt('<p>Hello <strong>world</strong></p>')).toBe(
			'Hello world'
		);
	});

	it('returns content unchanged when under the limit', () => {
		expect(generateExcerpt('Short text', 150)).toBe('Short text');
	});

	it('truncates long content with an ellipsis', () => {
		const excerpt = generateExcerpt('word '.repeat(100), 20);

		expect(excerpt).toBe('word word word word...');
	});
});

describe('slugify', () => {
	it('lowercases and hyphenates text', () => {
		expect(slugify('Hello World')).toBe('hello-world');
	});

	it('removes special characters', () => {
		expect(slugify("What's New in React 19?")).toBe('whats-new-in-react-19');
	});

	it('collapses whitespace and trims hyphens', () => {
		expect(slugify('  --spaced   out--  ')).toBe('spaced-out');
	});
});

describe('getImageUrl', () => {
	it('returns the image url when present', () => {
		expect(getImageUrl({ url: 'https://img.test/a.png' })).toBe(
			'https://img.test/a.png'
		);
	});

	it('falls back when image is missing', () => {
		expect(getImageUrl(null, '/fallback.png')).toBe('/fallback.png');
		expect(getImageUrl(undefined)).toBe('');
	});
});
