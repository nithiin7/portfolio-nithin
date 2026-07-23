import { commentsService } from 'services/comments';
import { viewsService } from 'services/views';
import type { BlogPost } from 'types/blog';

/**
 * Get related posts based on tags and category
 * @param currentPost - The current blog post
 * @param allPosts - Array of all blog posts
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts
 */
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

/**
 * Attach view and comment counts to a batch of posts for listing cards.
 * Missing rows in either service default to 0 rather than being dropped.
 */
export const enrichPostsWithCounts = async (
	posts: BlogPost[]
): Promise<BlogPost[]> => {
	if (posts.length === 0) return posts;

	const [{ data: viewCounts }, { data: commentCounts }] = await Promise.all([
		viewsService.getViewCounts(posts.map((post) => post.slug)),
		commentsService.getCommentCounts(posts.map((post) => post.id)),
	]);

	return posts.map((post) => ({
		...post,
		viewCount: viewCounts?.[post.slug] ?? 0,
		commentCount: commentCounts?.[post.id] ?? 0,
	}));
};
