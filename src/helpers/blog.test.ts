import { describe, expect, it } from 'vitest';

import { getRelatedPosts } from 'helpers/blog';
import type { BlogPost } from 'types/blog';

const makePost = (overrides: Partial<BlogPost>): BlogPost =>
	({
		id: 'post-1',
		title: 'Post',
		category: 'general',
		tags: [],
		...overrides,
	}) as BlogPost;

describe('getRelatedPosts', () => {
	const current = makePost({
		id: 'current',
		category: 'react',
		tags: ['hooks', 'performance'],
	});

	it('excludes the current post from results', () => {
		const posts = [current, makePost({ id: 'other' })];

		const related = getRelatedPosts(current, posts);

		expect(related.map((p) => p.id)).not.toContain('current');
	});

	it('ranks same-category posts above single-tag matches', () => {
		const sameCategory = makePost({ id: 'same-category', category: 'react' });
		const oneTagMatch = makePost({ id: 'one-tag', tags: ['hooks'] });

		const related = getRelatedPosts(current, [oneTagMatch, sameCategory]);

		expect(related.map((p) => p.id)).toEqual(['same-category', 'one-tag']);
	});

	it('ranks two tag matches (4) above category-only match (3)', () => {
		const categoryOnly = makePost({ id: 'category-only', category: 'react' });
		const twoTagMatch = makePost({
			id: 'two-tags',
			tags: ['hooks', 'performance'],
		});

		const related = getRelatedPosts(current, [categoryOnly, twoTagMatch]);

		expect(related.map((p) => p.id)).toEqual(['two-tags', 'category-only']);
	});

	it('limits results to the given count (default 3)', () => {
		const posts = Array.from({ length: 6 }, (_, i) =>
			makePost({ id: `post-${i}`, category: 'react' })
		);

		expect(getRelatedPosts(current, posts)).toHaveLength(3);
		expect(getRelatedPosts(current, posts, 5)).toHaveLength(5);
	});

	it('handles posts with missing tags', () => {
		const noTags = makePost({ id: 'no-tags', tags: undefined });
		const currentNoTags = makePost({ id: 'current', tags: undefined });

		expect(() => getRelatedPosts(currentNoTags, [noTags])).not.toThrow();
		expect(getRelatedPosts(currentNoTags, [noTags])).toHaveLength(1);
	});

	it('returns an empty array when there are no other posts', () => {
		expect(getRelatedPosts(current, [current])).toEqual([]);
	});
});
