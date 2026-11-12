import { NextResponse } from 'next/server';

import { loadBlogPosts, loadWork } from 'helpers/contentful';
import type { SearchIndex } from 'types/search';

export const revalidate = 3600;

export async function GET(): Promise<NextResponse<SearchIndex>> {
	const [blogData, work] = await Promise.all([
		loadBlogPosts(100, 0),
		loadWork(),
	]);
	const portfolioItems = work.map(({ slug, title }) => ({ slug, title }));

	const blogPosts = (blogData.data?.blogPostCollection?.items ?? []).map(
		(post) => ({ title: post.title, slug: post.slug })
	);

	return NextResponse.json({ blogPosts, portfolioItems });
}
