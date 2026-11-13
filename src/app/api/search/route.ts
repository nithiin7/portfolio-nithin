import { NextResponse } from 'next/server';

import { loadBlogPosts, loadWork } from 'helpers/contentful';
import type { SearchIndex } from 'types/search';

export const revalidate = 3600;

export async function GET(): Promise<NextResponse<SearchIndex>> {
	const [posts, work] = await Promise.all([loadBlogPosts(), loadWork()]);
	const portfolioItems = work.map(({ slug, title }) => ({ slug, title }));
	const blogPosts = posts.map(({ title, slug }) => ({ title, slug }));

	return NextResponse.json({ blogPosts, portfolioItems });
}
