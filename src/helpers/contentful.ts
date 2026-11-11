import type {
	ApolloClient,
	OperationVariables,
	TypedDocumentNode,
} from '@apollo/client';
import type { Document } from '@contentful/rich-text-types';
import type { DocumentNode } from 'graphql';

import { HOME_SECTIONS } from 'helpers/sections';
import { GET_PAGE, GET_ALL_BLOG_POSTS, GET_BLOG_POST_BY_SLUG } from 'queries';
import {
	GET_PORTFOLIO,
	GET_ALL_PORTFOLIO_IDS,
	GET_ALL_PORTFOLIO_TITLES,
	GET_PORTFOLIO_SUMMARIES,
	GET_WORKS_ORDER,
} from 'queries/portfolio';
import type { BlogPost } from 'types/blog';
import type {
	PageData,
	PortfolioData,
	PortfolioSearchItem,
	PortfolioSearchResponse,
	BlogPostItem,
	BlogPostsResponse,
	BlogPostBySlugResponse,
	WorksOrderResponse,
} from 'types/contentful';
import type { PortfolioItem } from 'types/portfolio';

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

const loadWorksOrder = async (): Promise<PortfolioItem[]> => {
	// An unpublished card is an UNRESOLVABLE_LINK error with that item nulled;
	// keep the rest of the order rather than failing the case study page
	const { data } = await getApolloClient().query({
		query: GET_WORKS_ORDER as TypedDocumentNode<WorksOrderResponse>,
		variables: { name: HOME_SECTIONS.portfolio },
		errorPolicy: 'all',
	});
	const lists =
		data?.sectionCollection?.items?.[0]?.contentsCollection?.items ?? [];
	return lists
		.flatMap((list) => list?.contentsCollection?.items ?? [])
		.flatMap((card) =>
			card?.id !== undefined && card.title
				? [{ id: card.id, title: card.title, image: card.image ?? { url: '' } }]
				: []
		);
};

const loadPortfolioSummaries = async (): Promise<Map<number, string>> => {
	const { data } = await runQuery<{
		portfolioDetailsCollection?: {
			items?: { id: number; shortDescription?: string | null }[];
		};
	}>(GET_PORTFOLIO_SUMMARIES);

	const entries = (data?.portfolioDetailsCollection?.items ?? []).flatMap(
		({ id, shortDescription }) =>
			shortDescription ? [[id, shortDescription] as const] : []
	);
	return new Map(entries);
};

export {
	loadData,
	loadPortfolioData,
	loadBlogPosts,
	loadBlogPostBySlug,
	loadAllPortfolioIds,
	loadPortfolioSearchItems,
	loadPortfolioSummaries,
	loadWorksOrder,
};
