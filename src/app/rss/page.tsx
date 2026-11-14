import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import RssFeed from 'components/pages/rss/RssFeed/RssFeed';
import { siteConfig } from 'config/site';
import { loadBlogPosts } from 'helpers/contentful';

export const revalidate = 3600;

const LATEST = 5;

export const metadata: Metadata = {
	title: 'RSS',
	description: 'Follow new writing in any feed reader.',
	alternates: {
		canonical: '/rss',
		types: { 'application/rss+xml': siteConfig.rssUrl },
	},
};

/** RSS info route. */
export default async function RssRoute(): Promise<ReactElement> {
	const posts = await loadBlogPosts(LATEST);
	return <RssFeed feedUrl={siteConfig.rssUrl} posts={posts} />;
}
