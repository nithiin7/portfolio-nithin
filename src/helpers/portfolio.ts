import type { PortfolioItem } from 'types/portfolio';

export const FEATURED_COUNT = 3;

/** Contentful Images API rendition small enough to inline as a blur placeholder. */
export const contentfulBlurSrc = (url: string): string => {
	const src = new URL(url.startsWith('//') ? `https:${url}` : url);
	src.searchParams.set('w', '24');
	src.searchParams.set('q', '40');
	src.searchParams.set('fm', 'jpg');
	return src.toString();
};

export const fetchBlurDataURL = async (
	url: string
): Promise<string | undefined> => {
	try {
		// Contentful asset URLs are content-addressed, so the rendition never changes
		const res = await fetch(contentfulBlurSrc(url), { cache: 'force-cache' });
		if (!res.ok) return undefined;
		const bytes = Buffer.from(await res.arrayBuffer());
		return `data:image/jpeg;base64,${bytes.toString('base64')}`;
	} catch {
		// A missing placeholder only costs the blur-up; never fail the page for it
		return undefined;
	}
};

export const enrichPortfolio = async (
	items: PortfolioItem[],
	summaries: Map<number, string>,
	getBlur: (url: string) => Promise<string | undefined> = fetchBlurDataURL
): Promise<PortfolioItem[]> =>
	Promise.all(
		items.map(async (item) => ({
			...item,
			summary:
				item.summary ??
				(item.id !== undefined ? summaries.get(item.id) : undefined),
			blurDataURL: item.image?.url ? await getBlur(item.image.url) : undefined,
			blurDataURLDark: item.imageDark?.url
				? await getBlur(item.imageDark.url)
				: undefined,
		}))
	);

export const splitFeatured = (
	items: PortfolioItem[],
	count = FEATURED_COUNT
): { featured: PortfolioItem[]; rest: PortfolioItem[] } => ({
	featured: items.slice(0, count),
	rest: items.slice(count),
});

/** Detail pages are keyed by the Contentful `id` field, not list position. */
export const portfolioHref = (item: PortfolioItem, index: number): string =>
	`/portfolio/${item.id ?? index + 1}`;
