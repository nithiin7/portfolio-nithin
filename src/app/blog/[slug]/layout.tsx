import type { Metadata } from 'next';
import Script from 'next/script';

import {
	loadBlogPostBySlug,
	convertContentfulBlogPost,
} from 'helpers/contentful';

interface BlogDetailLayoutProps {
	children: React.ReactNode;
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	const { data } = await loadBlogPostBySlug(slug);

	const post = data?.blogPostCollection?.items?.[0];
	if (!post) {
		return {
			title: 'Blog Post Not Found - Nithin Pradeep',
			description: 'The requested blog post could not be found.',
		};
	}

	const convertedPost = convertContentfulBlogPost(post);

	return {
		title: convertedPost.seoTitle || convertedPost.title,
		description: convertedPost.seoDescription || convertedPost.excerpt,
		keywords: convertedPost.seoKeywords || convertedPost.tags,
		openGraph: {
			type: 'article',
			locale: 'en_US',
			url: `https://portfolio-nithin.vercel.app/blog/${slug}`,
			title: convertedPost.seoTitle || convertedPost.title,
			description: convertedPost.seoDescription || convertedPost.excerpt,
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: convertedPost.featuredImage?.url || '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: convertedPost.featuredImage?.title || convertedPost.title,
				},
			],
			publishedTime: convertedPost.publishedDate,
			modifiedTime: convertedPost.updatedDate,
			authors: [convertedPost.authorName],
			tags: convertedPost.tags,
		},
		twitter: {
			card: 'summary_large_image',
			title: convertedPost.seoTitle || convertedPost.title,
			description: convertedPost.seoDescription || convertedPost.excerpt,
			creator: '@nithiin7',
			images: [convertedPost.featuredImage?.url || '/opengraph-image.jpeg'],
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
			canonical: `https://portfolio-nithin.vercel.app/blog/${slug}`,
		},
		other: {
			'article:published_time': convertedPost.publishedDate,
			'article:modified_time': convertedPost.updatedDate,
			'article:author': convertedPost.authorName,
			'article:section': convertedPost.category,
			'article:tag': convertedPost.tags,
			'article:reading_time': convertedPost.readTime.toString(),
		},
	};
}

export default async function BlogDetailLayout({
	children,
	params,
}: Readonly<BlogDetailLayoutProps>): Promise<React.ReactElement> {
	const { slug } = await params;

	const { data } = await loadBlogPostBySlug(slug);

	const post = data?.blogPostCollection?.items?.[0];
	if (!post) {
		return <>{children}</>;
	}

	const convertedPost = convertContentfulBlogPost(post);

	const blogPostStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: convertedPost.title,
		description: convertedPost.excerpt,
		image: convertedPost.featuredImage?.url,
		author: {
			'@type': 'Person',
			name: convertedPost.authorName,
			url: 'https://portfolio-nithin.vercel.app/',
			image: convertedPost.authorAvatar?.url,
		},
		publisher: {
			'@type': 'Person',
			name: 'Nithin Pradeep',
			url: 'https://portfolio-nithin.vercel.app/',
			sameAs: [
				'https://github.com/nithiin7',
				'https://www.linkedin.com/in/nithin-p7/',
				'https://www.instagram.com/__nithiin__/',
				'https://www.twitter.com/_nithiin7/',
			],
		},
		datePublished: convertedPost.publishedDate,
		dateModified: convertedPost.updatedDate || convertedPost.publishedDate,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://portfolio-nithin.vercel.app/blog/${slug}`,
		},
		wordCount: convertedPost.content
			? JSON.stringify(convertedPost.content).length
			: 0,
		timeRequired: `PT${convertedPost.readTime}M`,
		articleSection: convertedPost.category,
		keywords: convertedPost.tags.join(', '),
		url: `https://portfolio-nithin.vercel.app/blog/${slug}`,
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
				{
					'@type': 'ListItem',
					position: 3,
					name: convertedPost.title,
					item: `https://portfolio-nithin.vercel.app/blog/${slug}`,
				},
			],
		},
	};

	return (
		<>
			<Script
				id="blog-post-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(blogPostStructuredData),
				}}
			/>
			{children}
		</>
	);
}
