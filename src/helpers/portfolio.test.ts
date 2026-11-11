import { describe, expect, it, vi } from 'vitest';

import type { PortfolioItem } from 'types/portfolio';

import {
	contentfulBlurSrc,
	enrichPortfolio,
	portfolioHref,
	splitFeatured,
} from './portfolio';

const item = (
	id: number,
	extra: Partial<PortfolioItem> = {}
): PortfolioItem => ({
	id,
	title: `Project ${id}`,
	image: { url: `https://images.ctfassets.net/space/${id}/img.png` },
	...extra,
});

describe('contentfulBlurSrc', () => {
	it('requests a tiny JPEG rendition', () => {
		expect(contentfulBlurSrc('https://images.ctfassets.net/a/b.png')).toBe(
			'https://images.ctfassets.net/a/b.png?w=24&q=40&fm=jpg'
		);
	});

	it('handles protocol-relative asset URLs', () => {
		expect(contentfulBlurSrc('//images.ctfassets.net/a/b.png')).toMatch(
			/^https:\/\/images\.ctfassets\.net\/a\/b\.png\?/
		);
	});
});

describe('enrichPortfolio', () => {
	it('fills summary from details and attaches blur placeholders', async () => {
		const getBlur = vi.fn(async (url: string) => `blur:${url}`);
		const [a, b] = await enrichPortfolio(
			[item(1), item(2, { summary: 'Own summary' })],
			new Map([
				[1, 'From details'],
				[2, 'Ignored'],
			]),
			getBlur
		);

		expect(a.summary).toBe('From details');
		expect(b.summary).toBe('Own summary');
		expect(a.blurDataURL).toBe(`blur:${item(1).image.url}`);
		expect(getBlur).toHaveBeenCalledTimes(2);
	});

	it('leaves blur empty when the fetch fails', async () => {
		const [a] = await enrichPortfolio(
			[item(1)],
			new Map(),
			async () => undefined
		);
		expect(a.blurDataURL).toBeUndefined();
		expect(a.summary).toBeUndefined();
	});
});

describe('splitFeatured', () => {
	it('takes the first three as featured', () => {
		const items = [1, 2, 3, 4, 5].map((id) => item(id));
		const { featured, rest } = splitFeatured(items);
		expect(featured.map((p) => p.id)).toEqual([1, 2, 3]);
		expect(rest.map((p) => p.id)).toEqual([4, 5]);
	});

	it('handles fewer items than the featured count', () => {
		const { featured, rest } = splitFeatured([item(1)]);
		expect(featured).toHaveLength(1);
		expect(rest).toHaveLength(0);
	});
});

describe('portfolioHref', () => {
	it('uses the Contentful id over list position', () => {
		expect(portfolioHref(item(13), 0)).toBe('/portfolio/13');
		expect(portfolioHref({ title: 'x', image: { url: '' } }, 4)).toBe(
			'/portfolio/5'
		);
	});
});
