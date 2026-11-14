import { loadBlogPosts } from 'helpers/contentful';
import { commentsService } from 'services/comments';
import { viewsService } from 'services/views';
import type { BlogStats } from 'types/blog';

const TOP_POST_COUNT = 3;

/** Total views, comments and most viewed posts, or null if unavailable. */
export const loadBlogStats = async (): Promise<BlogStats | null> => {
	try {
		const [{ data: totalViews }, { data: totalComments }, { data: topViewed }] =
			await Promise.all([
				viewsService.getTotalViews(),
				commentsService.getTotalCommentCount(),
				viewsService.getTopViewed(TOP_POST_COUNT),
			]);

		if (totalViews === null || totalComments === null) return null;

		let topPosts: BlogStats['topPosts'] = [];

		if (topViewed?.length) {
			const posts = await loadBlogPosts();

			topPosts = topViewed.flatMap((view) => {
				const match = posts.find((post) => post.slug === view.slug);
				return match
					? [{ title: match.title, slug: view.slug, viewCount: view.viewCount }]
					: [];
			});
		}

		return { totalViews, totalComments, topPosts };
	} catch {
		return null;
	}
};
