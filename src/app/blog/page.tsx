import type { Metadata } from 'next';
import Script from 'next/script';

import { BlogListing } from 'components/pages';
import {
	loadData,
	loadBlogPosts,
	convertContentfulBlogPost,
} from 'helpers/contentful';

export async function generateMetadata(): Promise<Metadata> {
	const props = await loadData('blog');
	const path = props?.data.pageCollection.items[0];

	const blogData = await loadBlogPosts(10, 0);

	const latestPosts = blogData.data.blogPostCollection.items;

	return {
		title: path?.title || 'Blog - Nithin Pradeep',
		description:
			path?.description ||
			'Explore insights on design, development, and the intersection of creativity and technology. Read articles about web development, design trends, and industry best practices.',
		keywords: path?.keywords || [
			'blog',
			'web development',
			'design',
			'technology',
			'insights',
			'articles',
		],
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: 'https://portfolio-nithin.vercel.app/blog',
			title: path?.title || 'Blog - Nithin Pradeep',
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
			title: path?.title || 'Blog - Nithin Pradeep',
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
		other: {
			'article:published_time': latestPosts[0]?.publishedDate,
			'article:modified_time': latestPosts[0]?.updatedDate,
			'article:author': 'Nithin Pradeep',
			'article:section': 'Technology',
			'article:tag': latestPosts
				.flatMap((post: any) => post.tags || [])
				.slice(0, 10),
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

export default async function BlogPage(): Promise<React.ReactElement> {
	const blogData = await loadBlogPosts(10, 0);
	const latestPosts = blogData.data.blogPostCollection.items;
	const posts = latestPosts.map(convertContentfulBlogPost);

	return (
		<>
			<Script
				id="blog-listing-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(blogListingStructuredData),
				}}
			/>
			<BlogListing posts={posts} />
		</>
	);
}
