import type { Document } from '@contentful/rich-text-types';

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
	keywords: string[];
	sectionCollection: SectionCollection;
}

export interface SectionCollection {
	__typename: string;
	items: SectionItem[];
}

export interface SectionItem {
	__typename: string;
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

export interface PortfolioDetails {
	__typename: string;
	id: number;
	name: string;
	slug: string;
	title: string;
	shortDescription: string;
	keywords: string[];
	description: {
		json: Document;
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
	demo: string;
	github: string;
	tech: string[];
}
