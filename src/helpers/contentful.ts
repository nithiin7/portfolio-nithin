import type { ApolloQueryResult } from '@apollo/client';
import type { Document } from '@contentful/rich-text-types';

import { GET_PAGE, GET_ALL_BLOG_POSTS, GET_BLOG_POST_BY_SLUG } from 'queries';
import { GET_PORTFOLIO } from 'queries/portfolio';
import type { BlogPost, BlogCategory, BlogTag } from 'types/blog';
import type { PageData, PortfolioData } from 'types/contentful';
import type {
	BlogPostItem,
	BlogCategoryItem,
	BlogTagItem,
} from 'types/contentful';

import { initializeApollo } from '../../lib/apolloClient';

/**
 * Fetches page data from Contentful using Apollo Client.
 *
 * @param {string} page - The identifier for the page to be fetched.
 * @returns {Promise<ApolloQueryResult<PageData>>} - A promise that resolves to the page data from Contentful.
 */
const loadData = async (page: string): Promise<ApolloQueryResult<PageData>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<PageData>({
		query: GET_PAGE,
		variables: { page },
	});

	return data;
};

/**
 * Fetches Portfolio data from Contentful using Apollo Client.
 *
 * @param {string} id - The identifier for the portfolio to be fetched.
 * @returns {Promise<ApolloQueryResult<PageData>>} - A promise that resolves to the portfolio data from Contentful.
 */
const loadPortfolioData = async (
	id: string
): Promise<ApolloQueryResult<PortfolioData>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<PortfolioData>({
		query: GET_PORTFOLIO,
		variables: { id: parseInt(id, 10) },
	});

	return data;
};

export const convertContentfulBlogPost = (
	contentfulPost: BlogPostItem
): BlogPost => {
	return {
		id: contentfulPost.sys.id,
		title: contentfulPost.title,
		slug: contentfulPost.slug,
		excerpt: contentfulPost.excerpt,
		content: contentfulPost.content || { json: {} as Document },
		featuredImage: contentfulPost.featuredImage || {
			url: '',
			title: '',
			description: '',
		},
		category: contentfulPost.category,
		tags: contentfulPost.tags || [],
		authorName: contentfulPost.authorName,
		authorAvatar: contentfulPost.authorAvatar || {
			url: '',
			title: '',
			description: '',
		},
		publishedAt: contentfulPost.publishedDate,
		updatedAt: contentfulPost.updatedDate || contentfulPost.publishedDate,
		readTime: contentfulPost.readTime,
		publishedDate: contentfulPost.publishedDate,
		updatedDate: contentfulPost.updatedDate || contentfulPost.publishedDate,
		seoTitle: contentfulPost.seoTitle || '',
		seoDescription: contentfulPost.seoDescription || '',
	};
};

export const convertContentfulCategory = (
	contentfulCategory: BlogCategoryItem
): BlogCategory => {
	return {
		id: contentfulCategory.sys.id,
		name: contentfulCategory.name,
		slug: contentfulCategory.slug,
		description: contentfulCategory.description,
		postCount: 0,
	};
};

export const convertContentfulTag = (contentfulTag: BlogTagItem): BlogTag => {
	return {
		id: contentfulTag.sys.id,
		name: contentfulTag.name,
		slug: contentfulTag.slug,
		postCount: 0,
	};
};

/**
 * Fetches all blog posts from Contentful using Apollo Client.
 *
 * @param {number} limit - The maximum number of posts to fetch.
 * @param {number} skip - The number of posts to skip.
 * @returns {Promise<ApolloQueryResult<any>>} - A promise that resolves to the blog posts data from Contentful.
 */
const loadBlogPosts = async (
	limit = 10,
	skip = 0
): Promise<ApolloQueryResult<any>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query({
		query: GET_ALL_BLOG_POSTS,
		variables: { limit, skip },
	});

	return data;
};

/**
 * Fetches a specific blog post by slug from Contentful using Apollo Client.
 *
 * @param {string} slug - The slug of the blog post to fetch.
 * @returns {Promise<ApolloQueryResult<any>>} - A promise that resolves to the blog post data from Contentful.
 */
const loadBlogPostBySlug = async (
	slug: string
): Promise<ApolloQueryResult<any>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query({
		query: GET_BLOG_POST_BY_SLUG,
		variables: { slug },
	});

	return data;
};

export { loadData, loadPortfolioData, loadBlogPosts, loadBlogPostBySlug };
