import type { Document } from '@contentful/rich-text-types';

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: {
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
	publishedAt: string;
	updatedAt: string;
	readTime: number;
	authorName: string;
	authorAvatar: {
		url: string;
		title?: string;
		description?: string;
	};
	publishedDate: string;
	updatedDate: string;
	seoTitle: string;
	seoDescription: string;
	seoKeywords: string[];
}

export interface BlogCategory {
	id: string;
	name: string;
	slug: string;
	description?: string;
	postCount: number;
}

export interface BlogTag {
	id: string;
	name: string;
	slug: string;
	postCount: number;
}
