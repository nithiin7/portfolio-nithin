'use server';
import { loadBlogPosts, convertContentfulBlogPost } from 'helpers/contentful';
import type { BlogPost } from 'types/blog';

export async function fetchMorePosts(skip: number): Promise<BlogPost[]> {
	const blogData = await loadBlogPosts(10, skip);
	return blogData.data.blogPostCollection.items.map(convertContentfulBlogPost);
}
