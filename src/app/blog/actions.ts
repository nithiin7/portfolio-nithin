'use server';
import {
	loadBlogPosts,
	loadBlogPostsByCategory,
	loadBlogPostsByTag,
	convertContentfulBlogPost,
} from 'helpers/contentful';
import type { BlogPost } from 'types/blog';

export async function fetchFilteredPosts(
	skip: number,
	category?: string,
	tags: string[] = []
): Promise<{ posts: BlogPost[]; total: number }> {
	let blogData;
	if (category) {
		blogData = await loadBlogPostsByCategory(category, 10, skip);
	} else if (tags.length > 0) {
		blogData = await loadBlogPostsByTag(tags, 10, skip);
	} else {
		blogData = await loadBlogPosts(10, skip);
	}
	const collection = blogData?.data?.blogPostCollection;
	if (!collection) return { posts: [], total: 0 };
	return {
		posts: collection.items.map(convertContentfulBlogPost),
		total: collection.total,
	};
}
