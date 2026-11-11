import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SectionItem } from 'types/contentful';

import { getSection, HOME_SECTIONS } from './sections';

const section = (name: string, title = name): SectionItem =>
	({
		__typename: 'Section',
		name,
		contentsCollection: {
			__typename: 'SectionContentsCollection',
			items: [{ title }],
		},
	}) as unknown as SectionItem;

describe('getSection', () => {
	afterEach(() => vi.restoreAllMocks());

	it('resolves by Contentful name regardless of order', () => {
		const sections = [
			section(HOME_SECTIONS.career, 'career'),
			section(HOME_SECTIONS.header, 'header'),
		];

		expect(
			getSection(sections, 'header').contentsCollection.items[0].title
		).toBe('header');
		expect(
			getSection(sections, 'career').contentsCollection.items[0].title
		).toBe('career');
	});

	it('ignores case and surrounding whitespace', () => {
		const sections = [section('  home - about ', 'about')];

		expect(
			getSection(sections, 'about').contentsCollection.items[0].title
		).toBe('about');
	});

	it('returns an empty section and warns when missing', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = getSection([], 'testimonials');

		expect(result.name).toBe(HOME_SECTIONS.testimonials);
		expect(result.contentsCollection.items).toEqual([]);
		expect(warn).toHaveBeenCalledOnce();
	});
});
