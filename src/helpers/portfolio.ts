import type { PortfolioItem } from 'types/portfolio';

/** Projects shown as large featured cards before the Work index. */
export const FEATURED_COUNT = 3;

/** Contentful Images API rendition small enough to inline as a blur placeholder. */
export const contentfulBlurSrc = (url: string): string => {
	const src = new URL(url.startsWith('//') ? `https:${url}` : url);
	src.searchParams.set('w', '24');
	src.searchParams.set('q', '40');
	src.searchParams.set('fm', 'jpg');
	return src.toString();
};

/** Tiny JPEG rendition of a Contentful image as a data URL, for blur placeholders. */
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

/** Adds light and dark blur placeholders to each project. */
export const enrichPortfolio = async (
	items: PortfolioItem[],
	getBlur: (url: string) => Promise<string | undefined> = fetchBlurDataURL
): Promise<PortfolioItem[]> =>
	Promise.all(
		items.map(async (item) => ({
			...item,
			blurDataURL: item.image?.url ? await getBlur(item.image.url) : undefined,
			blurDataURLDark: item.imageDark?.url
				? await getBlur(item.imageDark.url)
				: undefined,
		}))
	);

/** First `count` projects are featured; the rest go to the index. */
export const splitFeatured = (
	items: PortfolioItem[],
	count = FEATURED_COUNT
): { featured: PortfolioItem[]; rest: PortfolioItem[] } => ({
	featured: items.slice(0, count),
	rest: items.slice(count),
});

/** Case-study URL for a project. */
export const portfolioHref = (item: Pick<PortfolioItem, 'slug'>): string =>
	`/portfolio/${item.slug}`;
