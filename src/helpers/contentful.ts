import type {
	ApolloClient,
	OperationVariables,
	TypedDocumentNode,
} from '@apollo/client';
import type { Document } from '@contentful/rich-text-types';
import type { DocumentNode } from 'graphql';

import {
	GET_PAGE,
	GET_ALL_BLOG_POSTS,
	GET_BLOG_POST_BY_SLUG,
	GET_FILTERED_BLOG_POSTS,
	GET_BLOG_CATEGORIES,
	GET_BLOG_TAGS,
} from 'queries';
import {
	GET_PORTFOLIO,
	GET_ALL_PORTFOLIO_IDS,
	GET_ALL_PORTFOLIO_TITLES,
} from 'queries/portfolio';
import type { BlogPost, BlogCategory, BlogTag } from 'types/blog';
import type {
	PageData,
	PortfolioData,
	PortfolioSearchItem,
	PortfolioSearchResponse,
	BlogPostItem,
	BlogCategoryItem,
	BlogTagItem,
	BlogPostsResponse,
	BlogPostBySlugResponse,
	BlogCategoriesResponse,
	BlogTagsResponse,
} from 'types/contentful';

import { getApolloClient } from '../../lib/apolloClient';

type QueryResult<TData> = ApolloClient.QueryResult<TData, 'none'>;

const runQuery = async <TData>(
	query: DocumentNode,
	variables?: OperationVariables
): Promise<QueryResult<TData>> => {
	const { data } = await getApolloClient().query({
		query: query as TypedDocumentNode<TData, OperationVariables>,
		variables,
	});

	// errorPolicy defaults to 'none', so a resolved query always has data
	return { data: data as TData };
};

const loadData = (page: string): Promise<QueryResult<PageData>> =>
	runQuery(GET_PAGE, { page });

const loadPortfolioData = (id: string): Promise<QueryResult<PortfolioData>> =>
	runQuery(GET_PORTFOLIO, { id: parseInt(id, 10) });

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
 * Fetches blog posts from Contentful filtered by category and/or tags (AND combined).
 */
const loadFilteredBlogPosts = (
	category?: string,
	tags: string[] = [],
	limit = 10,
	skip = 0
): Promise<QueryResult<BlogPostsResponse>> =>
	runQuery(GET_FILTERED_BLOG_POSTS, {
		limit,
		skip,
		...(category && { category }),
		...(tags.length > 0 && { tags }),
	});

const loadBlogCategories = (): Promise<QueryResult<BlogCategoriesResponse>> =>
	runQuery(GET_BLOG_CATEGORIES);

const loadBlogTags = (): Promise<QueryResult<BlogTagsResponse>> =>
	runQuery(GET_BLOG_TAGS);

const loadBlogPosts = (
	limit = 10,
	skip = 0
): Promise<QueryResult<BlogPostsResponse>> =>
	runQuery(GET_ALL_BLOG_POSTS, { limit, skip });

const loadBlogPostBySlug = (
	slug: string
): Promise<QueryResult<BlogPostBySlugResponse>> =>
	runQuery(GET_BLOG_POST_BY_SLUG, { slug });

const loadAllPortfolioIds = async (): Promise<number[]> => {
	const { data } = await runQuery<{
		portfolioDetailsCollection?: { items?: { id: number }[] };
	}>(GET_ALL_PORTFOLIO_IDS);

	return (
		data?.portfolioDetailsCollection?.items
			?.map((item) => item.id)
			.filter(Boolean) ?? []
	);
};

const loadPortfolioSearchItems = async (): Promise<PortfolioSearchItem[]> => {
	const { data } = await runQuery<PortfolioSearchResponse>(
		GET_ALL_PORTFOLIO_TITLES
	);

	return data?.portfolioDetailsCollection?.items ?? [];
};

export {
	loadData,
	loadPortfolioData,
	loadBlogPosts,
	loadFilteredBlogPosts,
	loadBlogCategories,
	loadBlogTags,
	loadBlogPostBySlug,
	loadAllPortfolioIds,
	loadPortfolioSearchItems,
};
