import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BlogDetail from 'components/pages/blog/BlogDetail/BlogDetail';
import JsonLd from 'components/utilities/JsonLd/JsonLd';
import { getRelatedPosts } from 'helpers/blog';
import { loadBlogPost, loadBlogPosts } from 'helpers/contentful';
import { plainText } from 'helpers/richText';

export const revalidate = 3600;

export async function generateStaticParams() {
	const posts = await loadBlogPosts();
	return posts.map(({ slug }) => ({ slug }));
}

interface BlogDetailLayoutProps {
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
	const convertedPost = await loadBlogPost(slug);
	if (!convertedPost) {
		return {
			title: 'Blog Post Not Found - Nithin Pradeep',
			description: 'The requested blog post could not be found.',
		};
	}

	return {
		title: convertedPost.seoTitle || convertedPost.title,
		description: convertedPost.seoDescription || convertedPost.excerpt,
		openGraph: {
			type: 'article',
			locale: 'en_US',
			url: `https://portfolio-nithin.vercel.app/blog/${slug}`,
			title: convertedPost.seoTitle || convertedPost.title,
			description: convertedPost.seoDescription || convertedPost.excerpt,
			siteName: 'Nithin Pradeep - Portfolio',
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

/** Blog post route. */
export default async function BlogDetails({
	params,
}: Readonly<BlogDetailLayoutProps>): Promise<React.ReactElement> {
	const { slug } = await params;

	const convertedPost = await loadBlogPost(slug);

	if (!convertedPost) {
		return notFound();
	}

	const allPosts = await loadBlogPosts();
	const related = getRelatedPosts(convertedPost, allPosts, 3);

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
		wordCount: plainText(convertedPost.content.json)
			.split(/\s+/)
			.filter(Boolean).length,
		timeRequired: `PT${convertedPost.readTime}M`,
		articleSection: convertedPost.category,
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
			<JsonLd id="blog-post-structured-data" data={blogPostStructuredData} />
			<BlogDetail post={convertedPost} relatedPosts={related} />
		</>
	);
}
