import { baseService } from 'services/index';
import type {
	BlogView,
	DatabaseBlogView,
	ServiceError,
	ServiceResponse,
} from 'types/view';

/**
 * Views service providing blog view counter operations
 */
export class ViewsService {
	private readonly tableName = 'blog_views';

	/**
	 * Increment the view count for a post. Writes go through the
	 * `increment_blog_view` RPC — the anon role has no INSERT/UPDATE
	 * grants on the table itself.
	 */
	async incrementView(slug: string): Promise<{ error: ServiceError }> {
		const { error } = await baseService.rpc('increment_blog_view', {
			post_slug: slug,
		});

		return { error };
	}

	/**
	 * Get the view count for a single post
	 */
	async getViewCount(slug: string): Promise<ServiceResponse<number>> {
		const { data, error } = await baseService.get<DatabaseBlogView>(
			this.tableName,
			{ slug },
			{ select: 'slug,view_count' }
		);

		if (error) {
			return { data: null, error };
		}

		return { data: data?.[0]?.view_count ?? 0, error: null };
	}

	/**
	 * Get view counts for a batch of posts, keyed by slug. Posts with no
	 * recorded views are simply absent from the result — callers should
	 * default missing slugs to 0.
	 */
	async getViewCounts(
		slugs: string[]
	): Promise<ServiceResponse<Record<string, number>>> {
		const { data, error } = await baseService.getWhereIn<DatabaseBlogView>(
			this.tableName,
			'slug',
			slugs,
			{ select: 'slug,view_count' }
		);

		if (error) {
			return { data: null, error };
		}

		const counts = (data ?? []).reduce<Record<string, number>>((acc, view) => {
			acc[view.slug] = view.view_count;
			return acc;
		}, {});
		return { data: counts, error: null };
	}

	/**
	 * Get the most viewed posts, for popular-post ordering
	 */
	async getTopViewed(limit = 5): Promise<ServiceResponse<BlogView[]>> {
		const { data, error } = await baseService.get<DatabaseBlogView>(
			this.tableName,
			undefined,
			{
				select: 'slug,view_count',
				orderBy: { column: 'view_count', ascending: false },
				limit,
			}
		);

		if (error) {
			return { data: null, error };
		}

		const views =
			data?.map((view) => ({ slug: view.slug, viewCount: view.view_count })) ??
			[];
		return { data: views, error: null };
	}
}

// Export a singleton instance
export const viewsService = new ViewsService();
