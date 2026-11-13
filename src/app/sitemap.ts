import type { MetadataRoute } from 'next';

import { siteConfig } from 'config/site';
import {
	convertContentfulBlogPost,
	loadBlogPosts,
	loadWork,
} from 'helpers/contentful';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = siteConfig.url;
	const currentDate = new Date().toISOString();

	const [blogData, work] = await Promise.all([
		loadBlogPosts(100, 0),
		loadWork(),
	]);

	const blogUrls: MetadataRoute.Sitemap =
		blogData.data?.blogPostCollection?.items?.map(
			(item: Parameters<typeof convertContentfulBlogPost>[0]) => {
				const post = convertContentfulBlogPost(item);
				return {
					url: `${baseUrl}/blog/${post.slug}`,
					lastModified: post.updatedDate || post.publishedDate,
					changeFrequency: 'monthly' as const,
					priority: 0.7,
				};
			}
		) ?? [];

	const portfolioUrls: MetadataRoute.Sitemap = work.map(({ slug }) => ({
		url: `${baseUrl}/portfolio/${slug}`,
		lastModified: currentDate,
		changeFrequency: 'monthly' as const,
		priority: 0.6,
	}));

	return [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: currentDate,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		...blogUrls,
		...portfolioUrls,
	];
}
