'use server';
import {
	loadFilteredBlogPosts,
	convertContentfulBlogPost,
} from 'helpers/contentful';
import type { BlogPost } from 'types/blog';

export async function fetchFilteredPosts(
	skip: number,
	category?: string,
	tags: string[] = [],
	limit = 10
): Promise<{ posts: BlogPost[]; total: number }> {
	const blogData = await loadFilteredBlogPosts(category, tags, limit, skip);
	const collection = blogData?.data?.blogPostCollection;
	if (!collection) return { posts: [], total: 0 };
	return {
		posts: collection.items.map(convertContentfulBlogPost),
		total: collection.total,
	};
}
