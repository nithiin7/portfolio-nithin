import type { Document } from '@contentful/rich-text-types';

import type { CaseStudyAsset } from 'types/caseStudy';

export interface PageData {
	pageCollection: PageCollection;
}

export interface PageCollection {
	__typename: string;
	items: ContentItem[];
}

export interface ContentItem {
	__typename: string;
	title: string;
	description: string;
	ogtitle: string;
	sectionCollection: SectionCollection;
}

export interface SectionCollection {
	__typename: string;
	items: SectionItem[];
}

export interface SectionItem {
	__typename: string;
	name: string;
	contentsCollection: ContentsCollection;
}

export interface ContentsCollection {
	__typename: string;
	items: Content[];
}

export interface Content {
	__typename: string;
	title: string;
	subTitle: string;
	contentsCollection: ContentsCollection;
	list: string[];
	image: { url: string };
	id: number;
	review: string;
	avatar: {
		url: string;
	};
	reviewer: string;
	institution: string;
	descriptionLong?: {
		json: Document;
	};
	name?: string;
	provider?: string;
	logo?: string;
	issuedDate?: string;
	expiryDate?: string;
	credentialId?: string;
	description?: string;
	skills?: string[];
	certificateUrl?: string;
	highlight?: boolean;
}

export interface ImageData {
	__typename: string;
	url: string;
	title?: string;
	description?: string;
}

export interface PortfolioData {
	portfolioDetailsCollection: PortfolioDetailsCollection;
}

export interface PortfolioDetailsCollection {
	__typename: string;
	items: PortfolioDetails[];
}

export interface PortfolioSearchItem {
	id: number;
	title: string;
}

export interface PortfolioSearchResponse {
	portfolioDetailsCollection: {
		items: PortfolioSearchItem[];
	};
}

export interface PortfolioDetails {
	__typename: string;
	id: number;
	name: string;
	slug: string;
	title: string;
	shortDescription: string;
	description: {
		json: Document;
		links?: {
			assets?: {
				block?: ({ sys: { id: string } } & CaseStudyAsset)[];
			};
		};
	};
	features: string[];
	spotlightImage: {
		url: string;
	};
	galleryCollection: {
		items: {
			description: string;
			url: string;
		}[];
	};
	year: string;
	/** Not in the Contentful model yet; rendered once a `role` field is added and queried. */
	role?: string;
	demo: string;
	github: string;
	tech: string[];
}

export interface WorksOrderResponse {
	sectionCollection?: {
		items?: {
			contentsCollection?: {
				items?: ({
					contentsCollection?: {
						items?: ({
							id?: number;
							title?: string;
							image?: { url: string };
						} | null)[];
					};
				} | null)[];
			};
		}[];
	};
}

export interface BlogPostCollection {
	__typename: string;
	total: number;
	items: BlogPostItem[];
}

export interface BlogPostItem {
	sys: {
		id: string;
	};
	title: string;
	slug: string;
	excerpt: string;
	content?: {
		json: Document;
		links?: {
			assets?: {
				block?: {
					sys: {
						id: string;
					};
					url: string;
					title: string;
					description?: string;
				}[];
			};
		};
	};
	featuredImage?: {
		url: string;
		title?: string;
		description?: string;
	};
	category: string;
	tags: string[];
	authorName: string;
	authorAvatar?: {
		url: string;
		title?: string;
		description?: string;
	};
	publishedDate: string;
	updatedDate?: string;
	readTime: number;
	seoTitle?: string;
	seoDescription?: string;
}

export interface BlogPostsResponse {
	blogPostCollection: BlogPostCollection;
}

export interface BlogPostBySlugResponse {
	blogPostCollection: {
		items: BlogPostItem[];
	};
}
