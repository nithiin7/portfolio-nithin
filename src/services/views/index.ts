import { baseService } from 'services/index';
import type { ServiceError, ServiceResponse } from 'types/service';
import type { BlogView, DatabaseBlogView } from 'types/view';

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

	/**
	 * Get the summed view count across every post, for site-wide stats
	 */
	async getTotalViews(): Promise<ServiceResponse<number>> {
		const { data, error } = await baseService.get<DatabaseBlogView>(
			this.tableName,
			undefined,
			{ select: 'view_count' }
		);

		if (error) {
			return { data: null, error };
		}

		const total = (data ?? []).reduce((sum, view) => sum + view.view_count, 0);
		return { data: total, error: null };
	}
}

export const viewsService = new ViewsService();
