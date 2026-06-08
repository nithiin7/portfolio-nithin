import type { ApolloQueryResult } from '@apollo/client';
import type { Document } from '@contentful/rich-text-types';

import {
	GET_PAGE,
	GET_ALL_BLOG_POSTS,
	GET_BLOG_POST_BY_SLUG,
	GET_BLOG_POSTS_BY_CATEGORY,
	GET_BLOG_POSTS_BY_TAG,
	GET_BLOG_CATEGORIES,
	GET_BLOG_TAGS,
} from 'queries';
import { GET_PORTFOLIO, GET_ALL_PORTFOLIO_IDS } from 'queries/portfolio';
import type { BlogPost, BlogCategory, BlogTag } from 'types/blog';
import type {
	PageData,
	PortfolioData,
	BlogPostItem,
	BlogCategoryItem,
	BlogTagItem,
	BlogPostsResponse,
	BlogPostBySlugResponse,
	BlogCategoriesResponse,
	BlogTagsResponse,
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
 * @returns {Promise<ApolloQueryResult<BlogPostsResponse>>} - A promise that resolves to the blog posts data from Contentful.
 */
const loadBlogPostsByCategory = async (
	category: string,
	limit = 10,
	skip = 0
): Promise<ApolloQueryResult<BlogPostsResponse>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<BlogPostsResponse>({
		query: GET_BLOG_POSTS_BY_CATEGORY,
		variables: { category, limit, skip },
	});
	return data;
};

const loadBlogPostsByTag = async (
	tags: string[],
	limit = 10,
	skip = 0
): Promise<ApolloQueryResult<BlogPostsResponse>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<BlogPostsResponse>({
		query: GET_BLOG_POSTS_BY_TAG,
		variables: { tags, limit, skip },
	});
	return data;
};

const loadBlogCategories = async (): Promise<
	ApolloQueryResult<BlogCategoriesResponse>
> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<BlogCategoriesResponse>({
		query: GET_BLOG_CATEGORIES,
	});
	return data;
};

const loadBlogTags = async (): Promise<ApolloQueryResult<BlogTagsResponse>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<BlogTagsResponse>({
		query: GET_BLOG_TAGS,
	});
	return data;
};

const loadBlogPosts = async (
	limit = 10,
	skip = 0
): Promise<ApolloQueryResult<BlogPostsResponse>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<BlogPostsResponse>({
		query: GET_ALL_BLOG_POSTS,
		variables: { limit, skip },
	});

	return data;
};

/**
 * Fetches a specific blog post by slug from Contentful using Apollo Client.
 *
 * @param {string} slug - The slug of the blog post to fetch.
 * @returns {Promise<ApolloQueryResult<BlogPostBySlugResponse>>} - A promise that resolves to the blog post data from Contentful.
 */
const loadBlogPostBySlug = async (
	slug: string
): Promise<ApolloQueryResult<BlogPostBySlugResponse>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<BlogPostBySlugResponse>({
		query: GET_BLOG_POST_BY_SLUG,
		variables: { slug },
	});

	return data;
};

const loadAllPortfolioIds = async (): Promise<number[]> => {
	const apolloClient = initializeApollo();
	const { data } = await apolloClient.query({
		query: GET_ALL_PORTFOLIO_IDS,
	});
	return (
		data?.portfolioDetailsCollection?.items
			?.map((item: { id: number }) => item.id)
			.filter(Boolean) ?? []
	);
};

export {
	loadData,
	loadPortfolioData,
	loadBlogPosts,
	loadBlogPostsByCategory,
	loadBlogPostsByTag,
	loadBlogCategories,
	loadBlogTags,
	loadBlogPostBySlug,
	loadAllPortfolioIds,
};
