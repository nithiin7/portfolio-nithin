import type { BlogPost } from 'types/blog';

/** Other posts ranked by shared category and tags. */
export const getRelatedPosts = (
	currentPost: BlogPost,
	allPosts: BlogPost[],
	limit = 3
): BlogPost[] => {
	const currentTags = currentPost.tags || [];
	const currentCategory = currentPost.category;

	const scoredPosts = allPosts
		.filter((post) => post.id !== currentPost.id)
		.map((post) => {
			let score = 0;

			if (post.category === currentCategory) {
				score += 3;
			}

			const postTags = post.tags || [];
			const tagMatches = currentTags.filter((tag) => postTags.includes(tag));
			score += tagMatches.length * 2;

			return { ...post, score };
		})
		.sort((a, b) => b.score - a.score);

	return scoredPosts.slice(0, limit);
};
