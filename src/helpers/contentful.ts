import type { ApolloQueryResult } from '@apollo/client';

import { GET_PAGE } from 'queries';
import { GET_PORTFOLIO } from 'queries/portfolio';
import type { PageData, PortfolioData } from 'types/contentful';

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

export { loadData, loadPortfolioData };
