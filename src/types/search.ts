export interface BlogSearchItem {
	title: string;
	slug: string;
}

export interface PortfolioSearchItem {
	slug: string;
	title: string;
}

export interface SearchIndex {
	blogPosts: BlogSearchItem[];
	portfolioItems: PortfolioSearchItem[];
}
