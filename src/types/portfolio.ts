export interface PortfolioMedia {
	url: string;
	contentType?: string;
}

export interface PortfolioItem {
	id?: number;
	slug: string;
	image: {
		url: string;
		description?: string | null;
	};
	imageDark?: { url: string; description?: string | null } | null;
	title: string;
	demo?: string;
	tech?: string[];
	year?: string;
	color?: string;
	type?: string;
	role?: string;
	summary?: string;
	coverVideo?: PortfolioMedia | null;
	blurDataURL?: string;
	blurDataURLDark?: string;
}
