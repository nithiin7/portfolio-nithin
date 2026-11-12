import type { ImageResponse } from 'next/og';

import {
	convertContentfulBlogPost,
	loadBlogPostBySlug,
	loadSiteSettings,
} from 'helpers/contentful';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = 'Article social card';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
	const { slug } = await params;
	const [{ data }, site] = await Promise.all([
		loadBlogPostBySlug(slug),
		loadSiteSettings(),
	]);
	const item = data?.blogPostCollection?.items?.[0];
	const post = item ? convertContentfulBlogPost(item) : null;

	return renderOgCard({
		kicker: '/BLOG',
		eyebrow: post?.category || 'Journal',
		title: post?.title ?? 'Writing',
		meta: [
			post?.readTime ? `${post.readTime} MIN READ` : '',
			site.name.toUpperCase(),
		]
			.filter(Boolean)
			.join(' — '),
	});
}
