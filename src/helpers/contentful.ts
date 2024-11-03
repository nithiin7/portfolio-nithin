import { initializeApollo } from '../../lib/apolloClient';
import { GET_PAGE } from 'queries';
import { ApolloQueryResult } from '@apollo/client';
import { PageData } from 'types/contentful';

const loadData = async (page: string): Promise<ApolloQueryResult<PageData>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<PageData>({
		query: GET_PAGE,
		variables: { page },
	});

	return data;
};

export default loadData;
