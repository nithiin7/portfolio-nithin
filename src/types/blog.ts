export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	featuredImage?: string;
	category: string;
	tags: string[];
	author: {
		name: string;
		avatar?: string;
	};
	publishedAt: string;
	updatedAt: string;
	readTime: number;
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
	};
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
