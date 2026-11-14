import type { PortfolioItem } from 'types/portfolio';

export const FEATURED_COUNT = 3;

/** Tiny JPEG URL of a Contentful image for blur placeholders. */
export const contentfulBlurSrc = (url: string): string => {
	const src = new URL(url.startsWith('//') ? `https:${url}` : url);
	src.searchParams.set('w', '24');
	src.searchParams.set('q', '40');
	src.searchParams.set('fm', 'jpg');
	return src.toString();
};

/** Base64 blur placeholder for an image, or undefined on failure. */
export const fetchBlurDataURL = async (
	url: string
): Promise<string | undefined> => {
	try {
		const res = await fetch(contentfulBlurSrc(url), { cache: 'force-cache' });
		if (!res.ok) return undefined;
		const bytes = Buffer.from(await res.arrayBuffer());
		return `data:image/jpeg;base64,${bytes.toString('base64')}`;
	} catch {
		return undefined;
	}
};

/** Adds light and dark blur placeholders to portfolio items. */
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

/** Splits items into featured and the rest. */
export const splitFeatured = (
	items: PortfolioItem[],
	count = FEATURED_COUNT
): { featured: PortfolioItem[]; rest: PortfolioItem[] } => ({
	featured: items.slice(0, count),
	rest: items.slice(count),
});

/** Case-study URL of a project. */
export const portfolioHref = (item: Pick<PortfolioItem, 'slug'>): string =>
	`/portfolio/${item.slug}`;
