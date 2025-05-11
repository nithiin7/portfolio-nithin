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
}

export interface ImageData {
	__typename: string;
	url: string;
	title?: string;
	description?: string;
}
