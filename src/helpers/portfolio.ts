import type { PortfolioItem } from 'types/portfolio';

export const FEATURED_COUNT = 3;

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
		const res = await fetch(contentfulBlurSrc(url), { cache: 'force-cache' });
		if (!res.ok) return undefined;
		const bytes = Buffer.from(await res.arrayBuffer());
		return `data:image/jpeg;base64,${bytes.toString('base64')}`;
	} catch {
		return undefined;
	}
};

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

export const splitFeatured = (
	items: PortfolioItem[],
	count = FEATURED_COUNT
): { featured: PortfolioItem[]; rest: PortfolioItem[] } => ({
	featured: items.slice(0, count),
	rest: items.slice(count),
});

export const portfolioHref = (item: Pick<PortfolioItem, 'slug'>): string =>
	`/portfolio/${item.slug}`;
