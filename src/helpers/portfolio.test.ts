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
	slug: `project-${id}`,
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
	it('attaches blur placeholders for both covers', async () => {
		const getBlur = vi.fn(async (url: string) => `blur:${url}`);
		const [a] = await enrichPortfolio(
			[item(1, { imageDark: { url: 'https://images.ctfassets.net/d.png' } })],
			getBlur
		);

		expect(a!.blurDataURL).toBe(`blur:${item(1).image.url}`);
		expect(a!.blurDataURLDark).toBe('blur:https://images.ctfassets.net/d.png');
		expect(getBlur).toHaveBeenCalledTimes(2);
	});

	it('leaves blur empty when the fetch fails', async () => {
		const [a] = await enrichPortfolio([item(1)], async () => undefined);
		expect(a!.blurDataURL).toBeUndefined();
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
	it('links the case study by slug', () => {
		expect(portfolioHref(item(13))).toBe('/portfolio/project-13');
	});
});
