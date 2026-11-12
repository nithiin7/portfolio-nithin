import type { Metadata } from 'next';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import BlogListing from 'components/pages/blog/BlogListing/BlogListing';
import { absoluteUrl, personJsonLd, siteConfig } from 'config/site';
import { categoriesFromPosts } from 'helpers/blogPosts';
import {
	convertContentfulBlogPost,
	loadBlogPosts,
	loadData,
} from 'helpers/contentful';

interface BlogPageProps {
	searchParams: Promise<{
		category?: string;
		tag?: string | string[];
	}>;
}

const ARCHIVE_LIMIT = 100;
const DEFAULT_DESCRIPTION =
	'Field notes on AI agents, MCP and the web platform by Nithin Pradeep.';

const firstTag = (tag: string | string[] | undefined): string | undefined =>
	(Array.isArray(tag) ? tag.join(',') : tag)?.split(',').find(Boolean);

export async function generateMetadata({
	searchParams,
}: BlogPageProps): Promise<Metadata> {
	const { category, tag } = await searchParams;
	const props = await loadData('blog');
	const page = props?.data.pageCollection.items[0];

	const tagName = firstTag(tag);
	const suffix = category ? ` — ${category}` : tagName ? ` — #${tagName}` : '';
	const title = `${page?.title || 'Writing'}${suffix}`;
	const description = page?.description || DEFAULT_DESCRIPTION;
	const url = absoluteUrl('/blog');

	return {
		title,
		description,
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url,
			title,
			description,
			siteName: siteConfig.siteName,
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: siteConfig.twitterHandle,
		},
		alternates: {
			canonical: url,
			types: { 'application/rss+xml': siteConfig.rssUrl },
		},
	};
}

export default async function BlogPage({
	searchParams,
}: BlogPageProps): Promise<React.ReactElement> {
	// Filters live in the URL and are applied client-side, but reading them here
	// keeps the route dynamic so the filtered list is server-rendered.
	await searchParams;
	const { data } = await loadBlogPosts(ARCHIVE_LIMIT, 0);
	const posts = (data?.blogPostCollection?.items ?? []).map(
		convertContentfulBlogPost
	);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: `${siteConfig.name} — Writing`,
		description: DEFAULT_DESCRIPTION,
		url: absoluteUrl('/blog'),
		author: personJsonLd,
		blogPost: posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			url: absoluteUrl(`/blog/${post.slug}`),
			datePublished: post.publishedDate,
		})),
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl() },
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Writing',
					item: absoluteUrl('/blog'),
				},
			],
		},
	};

	return (
		<>
			<Script
				id="blog-listing-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			{/* Scoped here: /blog is the only route with URL-state filters */}
			<NuqsAdapter>
				<BlogListing posts={posts} categories={categoriesFromPosts(posts)} />
			</NuqsAdapter>
		</>
	);
}
