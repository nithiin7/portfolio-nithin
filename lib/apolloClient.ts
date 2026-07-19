import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import * as Sentry from '@sentry/nextjs';
import { cache } from 'react';

import { serverEnv } from 'helpers/env';

const errorLink = new ErrorLink(({ error, operation }) => {
	if (process.env.NODE_ENV !== 'production') {
		console.error(`[Contentful GraphQL] ${operation.operationName}:`, error);
		return;
	}

	Sentry.captureException(error, {
		tags: { source: 'contentful-graphql' },
		extra: { operationName: operation.operationName },
	});
});

const httpLink = new HttpLink({
	uri: `https://graphql.contentful.com/content/${serverEnv.CONTENTFUL_VERSION}/spaces/${serverEnv.CONTENTFUL_SPACE_ID}/environments/${serverEnv.CONTENTFUL_ENVIRONMENT}`,
	headers: {
		Authorization: `Bearer ${serverEnv.CONTENTFUL_ACCESS_TOKEN}`,
	},
});

// cache() shares one client per server request, so repeated queries
// (e.g. loadData('home') in both layout and page) hit the in-memory cache
export const getApolloClient = cache(
	(): ApolloClient =>
		new ApolloClient({
			link: ApolloLink.from([errorLink, httpLink]),
			cache: new InMemoryCache(),
		})
);
