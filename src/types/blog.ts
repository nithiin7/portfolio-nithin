import type { Document } from '@contentful/rich-text-types';

export interface BlogAsset {
	sys: {
		id: string;
	};
	url: string;
	title: string;
	description?: string;
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: {
		json: Document;
		links?: {
			assets?: {
				block?: BlogAsset[];
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
	viewCount?: number;
	commentCount?: number;
}

export interface BlogTopPost {
	title: string;
	slug: string;
	viewCount: number;
}

export interface BlogStats {
	totalViews: number;
	totalComments: number;
	topPosts: BlogTopPost[];
}
