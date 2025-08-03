'use client';
import type { FC } from 'react';

import { blogData } from 'constants/blogData';

interface BlogDetailPageProps {
	params: {
		slug: string;
	};
}

/**
 * Blog detail page component
 */
const BlogDetailPage: FC<BlogDetailPageProps> = ({ params }) => {
	const post = blogData.find((p) => p.slug === params.slug);

	return (
		<div style={{ padding: '2rem', textAlign: 'center' }}>
			<h1>Blog Detail Page</h1>
			<p>Slug: {params.slug}</p>
			<p>Title: {post?.title}</p>
			<p>This page will be implemented in the next phase.</p>
		</div>
	);
};

export default BlogDetailPage;
