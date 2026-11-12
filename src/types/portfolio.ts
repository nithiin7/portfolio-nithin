export interface PortfolioMedia {
	url: string;
	contentType?: string;
}

export interface PortfolioItem {
	id?: number;
	/** Light-theme cover; also the fallback when there is no dark one. */
	image: {
		url: string;
	};
	imageDark?: { url: string } | null;
	title: string;
	demo?: string;
	tech?: string[];
	year?: string;
	color?: string;
	/** Short text field on PortfolioCard ("AI Agent", "Web App"…). */
	type?: string;
	/** Short text field on PortfolioCard ("Solo build", "Lead engineer"…). */
	role?: string;
	/** Falls back to PortfolioDetails.shortDescription when the card has none. */
	summary?: string;
	coverVideo?: PortfolioMedia | null;
	/** Tiny base64 JPEG built server-side from the Contentful Images API. */
	blurDataURL?: string;
	blurDataURLDark?: string;
}
