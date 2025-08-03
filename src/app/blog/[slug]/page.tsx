import type { FC } from 'react';

import BlogDetailClient from './BlogDetailClient';

interface BlogDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

/**
 * Blog detail page wrapper component
 */
const BlogDetailPage: FC<BlogDetailPageProps> = async ({ params }) => {
	const { slug } = await params;

	return <BlogDetailClient slug={slug} />;
};

export default BlogDetailPage;
