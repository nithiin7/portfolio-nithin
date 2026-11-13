import type { MetadataRoute } from 'next';

import { siteConfig } from 'config/site';
import { loadBlogPosts, loadWork } from 'helpers/contentful';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = siteConfig.url;
	const currentDate = new Date().toISOString();

	const [posts, work] = await Promise.all([loadBlogPosts(), loadWork()]);

	const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: post.updatedDate || post.publishedDate,
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}));

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
