import type { ImageResponse } from 'next/og';

import { loadBlogPost, loadSiteSettings } from 'helpers/contentful';
import { ogContentType, ogSize, renderOgCard } from 'helpers/og';

export const alt = 'Article social card';
export const size = ogSize;
export const contentType = ogContentType;

/** OG image for a blog post. */
export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
	const { slug } = await params;
	const [post, site] = await Promise.all([
		loadBlogPost(slug),
		loadSiteSettings(),
	]);

	return renderOgCard({
		kicker: '/BLOG',
		eyebrow: post?.category || 'Journal',
		title: post?.title ?? 'Writing',
		meta: [
			post?.readTime ? `${post.readTime} MIN READ` : '',
			site.name.toUpperCase(),
		]
			.filter(Boolean)
			.join(' · '),
	});
}
