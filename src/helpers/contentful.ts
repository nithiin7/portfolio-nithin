import { initializeApollo } from '/lib/apolloClient';
import { GET_PAGE } from 'queries';
import { ApolloQueryResult } from '@apollo/client';

interface PageData {
	// Define the structure of the data returned by GET_PAGE here
	// For example:
	// page: {
	//     id: string;
	//     title: string;
	//     content: string;
	// };
}

const loadData = async (page: string): Promise<ApolloQueryResult<PageData>> => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query<PageData>({
		query: GET_PAGE,
		variables: { page },
	});

	return data;
};

export default loadData;
