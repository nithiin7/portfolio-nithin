export interface PortfolioMedia {
	url: string;
	contentType?: string;
}

export interface PortfolioItem {
	/** Legacy numeric id: stable key for list positions and old URLs. */
	id?: number;
	slug: string;
	/** Light-theme cover; also the fallback when there is no dark one. */
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
	/** e.g. "Solo — design, build, deploy". */
	role?: string;
	summary?: string;
	coverVideo?: PortfolioMedia | null;
	/** Tiny base64 JPEG built server-side from the Contentful Images API. */
	blurDataURL?: string;
	blurDataURLDark?: string;
}
