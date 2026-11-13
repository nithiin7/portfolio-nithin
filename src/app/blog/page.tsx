import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import BlogListing from 'components/pages/blog/BlogListing/BlogListing';
import JsonLd from 'components/utilities/JsonLd/JsonLd';
import { absoluteUrl, personJsonLd, siteConfig, siteName } from 'config/site';
import { categoriesFromPosts } from 'helpers/blogPosts';
import {
	convertContentfulBlogPost,
	loadBlogPosts,
	loadPageSeo,
	loadSiteSettings,
} from 'helpers/contentful';
import type { Seo, SiteSettings } from 'types/site';

interface BlogPageProps {
	searchParams: Promise<{
		category?: string;
		tag?: string | string[];
	}>;
}

const ARCHIVE_LIMIT = 100;
/** Page "blog" SEO from Contentful, falling back to the site default. */
const blogSeo = async (): Promise<[Seo, SiteSettings]> => {
	const [seo, site] = await Promise.all([
		loadPageSeo('blog'),
		loadSiteSettings(),
	]);
	return [seo ?? site.seo, site];
};

const firstTag = (tag: string | string[] | undefined): string | undefined =>
	(Array.isArray(tag) ? tag.join(',') : tag)?.split(',').find(Boolean);

export async function generateMetadata({
	searchParams,
}: BlogPageProps): Promise<Metadata> {
	const { category, tag } = await searchParams;
	const [seo, site] = await blogSeo();

	const tagName = firstTag(tag);
	const suffix = category ? ` — ${category}` : tagName ? ` — #${tagName}` : '';
	const title = `${seo.title}${suffix}`;
	const { description } = seo;
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
			siteName: siteName(site),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			creator: site.twitterHandle,
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
	const [{ data }, [seo, site]] = await Promise.all([
		loadBlogPosts(ARCHIVE_LIMIT, 0),
		blogSeo(),
	]);
	const posts = (data?.blogPostCollection?.items ?? []).map(
		convertContentfulBlogPost
	);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: `${site.name} — ${seo.title}`,
		description: seo.description,
		url: absoluteUrl('/blog'),
		author: personJsonLd(site),
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
			<JsonLd id="blog-listing-structured-data" data={structuredData} />
			{/* Scoped here: /blog is the only route with URL-state filters */}
			<NuqsAdapter>
				<BlogListing posts={posts} categories={categoriesFromPosts(posts)} />
			</NuqsAdapter>
		</>
	);
}
