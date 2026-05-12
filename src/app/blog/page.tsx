import type { Metadata } from 'next';
import Script from 'next/script';

import { BlogListing } from 'components/pages';
import {
	loadData,
	loadBlogPosts,
	loadBlogPostsByCategory,
	loadBlogPostsByTag,
	loadBlogCategories,
	loadBlogTags,
	convertContentfulBlogPost,
} from 'helpers/contentful';
import type { BlogPost } from 'types/blog';
import type { BlogCategoryItem, BlogTagItem } from 'types/contentful';

interface BlogPageProps {
	searchParams: Promise<{
		category?: string;
		tag?: string | string[];
	}>;
}

function resolveTagParam(tag: string | string[] | undefined): string[] {
	if (!tag) return [];
	return Array.isArray(tag) ? tag : [tag];
}

export async function generateMetadata({
	searchParams,
}: BlogPageProps): Promise<Metadata> {
	const { category, tag } = await searchParams;
	const tags = resolveTagParam(tag);
	const props = await loadData('blog');
	const path = props?.data.pageCollection.items[0];

	const titleSuffix = category
		? ` — ${category}`
		: tags.length > 0
			? ` — #${tags[0]}`
			: '';

	return {
		title: `${path?.title || 'Blog - Nithin Pradeep'}${titleSuffix}`,
		description:
			path?.description ||
			'Explore insights on design, development, and the intersection of creativity and technology. Read articles about web development, design trends, and industry best practices.',
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: 'https://portfolio-nithin.vercel.app/blog',
			title: `${path?.title || 'Blog - Nithin Pradeep'}${titleSuffix}`,
			description:
				path?.description ||
				'Explore insights on design, development, and the intersection of creativity and technology.',
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: 'Blog - Nithin Pradeep - Full Stack Developer',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${path?.title || 'Blog - Nithin Pradeep'}${titleSuffix}`,
			description:
				path?.description ||
				'Explore insights on design, development, and the intersection of creativity and technology.',
			creator: '@nithiin7',
			images: ['/opengraph-image.jpeg'],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		alternates: {
			canonical: 'https://portfolio-nithin.vercel.app/blog',
		},
	};
}

const blogListingStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'Blog',
	name: 'Nithin Pradeep Blog',
	description:
		'Insights on design, development, and the intersection of creativity and technology',
	url: 'https://portfolio-nithin.vercel.app/blog',
	author: {
		'@type': 'Person',
		name: 'Nithin Pradeep',
		jobTitle: 'Full Stack Developer',
		url: 'https://portfolio-nithin.vercel.app/',
		sameAs: [
			'https://github.com/nithiin7',
			'https://www.linkedin.com/in/nithin-p7/',
			'https://www.instagram.com/__nithiin__/',
			'https://www.twitter.com/_nithiin7/',
		],
	},
	publisher: {
		'@type': 'Person',
		name: 'Nithin Pradeep',
		url: 'https://portfolio-nithin.vercel.app/',
	},
	mainEntity: {
		'@type': 'ItemList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: 'https://portfolio-nithin.vercel.app/',
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Blog',
				item: 'https://portfolio-nithin.vercel.app/blog',
			},
		],
	},
	breadcrumb: {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: 'https://portfolio-nithin.vercel.app/',
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Blog',
				item: 'https://portfolio-nithin.vercel.app/blog',
			},
		],
	},
};

export default async function BlogPage({
	searchParams,
}: BlogPageProps): Promise<React.ReactElement> {
	const { category, tag } = await searchParams;
	const initialTags = resolveTagParam(tag);

	const [blogData, categoriesData, tagsData] = await Promise.all([
		category
			? loadBlogPostsByCategory(category, 10, 0)
			: initialTags.length > 0
				? loadBlogPostsByTag(initialTags, 10, 0)
				: loadBlogPosts(10, 0),
		loadBlogCategories(),
		loadBlogTags(),
	]);

	const { total, items } = blogData.data.blogPostCollection;
	const posts: BlogPost[] = items.map(convertContentfulBlogPost);

	const allCategories: string[] = [
		'All',
		...categoriesData.data.blogCategoryCollection.items.map(
			(c: BlogCategoryItem) => c.name
		),
	];

	const allTags: string[] = tagsData.data.blogTagCollection.items.map(
		(t: BlogTagItem) => t.name
	);

	return (
		<>
			<Script
				id="blog-listing-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(blogListingStructuredData),
				}}
			/>
			<BlogListing
				posts={posts}
				total={total}
				allCategories={allCategories}
				allTags={allTags}
				initialCategory={category ?? 'All'}
				initialTags={initialTags}
			/>
		</>
	);
}
