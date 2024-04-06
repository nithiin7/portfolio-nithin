import { initializeApollo } from '/lib/apolloClient';
import { GET_PAGE } from 'queries';

const loadData = async (page) => {
	const apolloClient = initializeApollo();
	const data = await apolloClient.query({
		query: GET_PAGE,
		variables: { page: page },
	});

	return data;
};

export default loadData;
