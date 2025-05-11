import type { ApolloQueryResult } from '@apollo/client';
import { GET_PAGE } from 'queries';
import type { PageData } from 'types/contentful';

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

export default loadData;
