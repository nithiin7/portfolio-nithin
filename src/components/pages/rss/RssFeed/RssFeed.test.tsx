import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RssFeed from './RssFeed';

const feedUrl = 'https://example.com/feed.xml';
const posts = [
	{
		id: '1',
		slug: 'first-post',
		title: 'First post',
		publishedDate: '2026-05-20T12:00:00.000Z',
	},
];

describe('RssFeed', () => {
	it('offers the feed address to copy and the raw feed', () => {
		render(<RssFeed feedUrl={feedUrl} posts={posts} />);

		expect(
			screen.getByRole('heading', { level: 1, name: 'Subscribe' })
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: new RegExp(feedUrl) })).toBe(
			screen.getByText(feedUrl).closest('button')
		);
		expect(screen.getByRole('link', { name: 'Raw feed' })).toHaveAttribute(
			'href',
			feedUrl
		);
	});

	it('lists the latest posts, linked and dated', () => {
		render(<RssFeed feedUrl={feedUrl} posts={posts} />);

		expect(screen.getByRole('link', { name: /First post/ })).toHaveAttribute(
			'href',
			'/blog/first-post'
		);
		expect(screen.getByText('May 20, 2026')).toHaveAttribute(
			'datetime',
			posts[0]?.publishedDate
		);
	});

	it('drops the latest list when there are no posts', () => {
		render(<RssFeed feedUrl={feedUrl} posts={[]} />);

		expect(
			screen.queryByRole('heading', { name: 'Latest in the feed' })
		).not.toBeInTheDocument();
	});
});
