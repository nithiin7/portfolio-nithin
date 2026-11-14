import { describe, expect, it } from 'vitest';

import type { BlogPost } from 'types/blog';

import {
	categoriesFromPosts,
	filterPosts,
	formatPostDate,
	isFiltering,
} from './blogPosts';

const post = (overrides: Partial<BlogPost>): BlogPost =>
	({
		id: overrides.slug ?? 'p',
		slug: 'p',
		title: 'Post',
		excerpt: '',
		category: 'AI',
		tags: [],
		...overrides,
	}) as BlogPost;

const posts = [
	post({ slug: 'mcp', title: 'What is MCP', category: 'AI', tags: ['mcp'] }),
	post({
		slug: 'agents',
		title: 'Agentic AI',
		category: 'AI',
		tags: ['agents', 'mcp'],
	}),
	post({
		slug: 'perf',
		title: 'Frontend performance',
		excerpt: 'Core Web Vitals in practice',
		category: 'Frontend',
	}),
];

describe('categoriesFromPosts', () => {
	it('counts categories and orders by frequency, then name', () => {
		expect(
			categoriesFromPosts([...posts, post({ category: 'Backend' })])
		).toEqual([
			{ name: 'AI', count: 2 },
			{ name: 'Backend', count: 1 },
			{ name: 'Frontend', count: 1 },
		]);
	});
});

describe('filterPosts', () => {
	const slugs = (list: BlogPost[]) => list.map((p) => p.slug);

	it('returns everything with no filter', () => {
		expect(filterPosts(posts, {})).toHaveLength(3);
	});

	it('filters by exact category', () => {
		expect(slugs(filterPosts(posts, { category: 'AI' }))).toEqual([
			'mcp',
			'agents',
		]);
	});

	it('requires every selected tag', () => {
		expect(slugs(filterPosts(posts, { tags: ['mcp', 'agents'] }))).toEqual([
			'agents',
		]);
	});

	it('searches title, excerpt, category and tags case-insensitively', () => {
		expect(slugs(filterPosts(posts, { query: 'web vitals' }))).toEqual([
			'perf',
		]);
		expect(slugs(filterPosts(posts, { query: '  AGENTS ' }))).toEqual([
			'agents',
		]);
	});

	it('combines filters', () => {
		expect(filterPosts(posts, { category: 'Frontend', query: 'mcp' })).toEqual(
			[]
		);
	});
});

describe('isFiltering', () => {
	it('ignores whitespace-only queries', () => {
		expect(isFiltering({ query: '   ' })).toBe(false);
		expect(isFiltering({ category: 'AI' })).toBe(true);
		expect(isFiltering({ tags: ['x'] })).toBe(true);
	});
});

describe('formatPostDate', () => {
	it('shows the calendar day as written, whatever its offset', () => {
		expect(formatPostDate('2025-03-01T23:30:00.000Z')).toBe('01 Mar 2025');
		expect(formatPostDate('2026-11-11T00:00:00.000+05:30', 'long')).toBe(
			'11 November 2026'
		);
		expect(formatPostDate('2025-03-01T00:30:00-08:00')).toBe('01 Mar 2025');
	});

	it('returns an empty string for invalid dates', () => {
		expect(formatPostDate('nope')).toBe('');
	});
});
