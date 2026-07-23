import { loadBlogPosts } from 'helpers/contentful';
import { commentsService } from 'services/comments';
import { viewsService } from 'services/views';
import type { BlogStats } from 'types/blog';

const TOP_POST_COUNT = 3;

/**
 * Site-wide blog stats for the /stats page: total views, total approved
 * comments, and the most-read posts (titles cross-referenced from Contentful,
 * since `blog_views` only stores the slug). Deliberately NOT re-exported
 * from helpers/index.ts — that barrel is pulled into client bundles (e.g.
 * via Menu.tsx), and loadBlogPosts drags in the server-only Apollo client.
 */
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
			const { data } = await loadBlogPosts(100, 0);
			const posts = data?.blogPostCollection?.items ?? [];

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
