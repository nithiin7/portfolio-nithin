import type { PortfolioSearchItem } from 'types/contentful';

export interface BlogSearchItem {
	title: string;
	slug: string;
}

export interface SearchIndex {
	blogPosts: BlogSearchItem[];
	portfolioItems: PortfolioSearchItem[];
}
