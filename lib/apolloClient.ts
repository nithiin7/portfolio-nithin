import { useMemo } from 'react';
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	from,
	NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { concatPagination } from '@apollo/client/utilities';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
		);
	}
	if (networkError) {
		console.log(`[Network error]: ${networkError}`);
	}
});

const httpLink = new HttpLink({
	uri: `https://graphql.contentful.com/content/${process.env.NEXT_PUBLIC_VERSION}/spaces/${process.env.NEXT_PUBLIC_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_ENVIRONMENT}`,
	credentials: 'same-origin',
	headers: {
		Authorization: `Bearer ${
			process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN || ''
		}`,
	},
});

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: from([errorLink, httpLink]),
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						allPosts: concatPagination(),
					},
				},
			},
		}),
	});
};

export function initializeApollo(
	initialState: NormalizedCacheObject | null = null
): ApolloClient<NormalizedCacheObject> {
	const _apolloClient = apolloClient ?? createApolloClient();

	if (initialState) {
		const existingCache = _apolloClient.extract();
		const data = merge(existingCache, initialState, {
			arrayMerge: (destinationArray: unknown[], sourceArray: unknown[]) => [
				...sourceArray,
				...destinationArray.filter((d) =>
					sourceArray.every((s) => !isEqual(d, s))
				),
			],
		});
		_apolloClient.cache.restore(data);
	}
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

type ApolloPageProps = {
	[key: string]: any;
	props?: Record<string, unknown>;
};

export const addApolloState = (
	client: ApolloClient<NormalizedCacheObject>,
	pageProps: ApolloPageProps
): ApolloPageProps => {
	if (pageProps?.props) {
		pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
	}

	return pageProps;
};

export const useApollo = (
	pageProps: ApolloPageProps
): ApolloClient<NormalizedCacheObject> => {
	const state = pageProps[APOLLO_STATE_PROP_NAME] as
		| NormalizedCacheObject
		| undefined;
	const store = useMemo(() => initializeApollo(state), [state]);
	return store;
};
