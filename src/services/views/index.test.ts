import { beforeEach, describe, expect, it, vi } from 'vitest';

import { baseService } from 'services/index';
import { viewsService } from 'services/views';

vi.mock('services/index', () => ({
	baseService: {
		get: vi.fn(),
		rpc: vi.fn(),
	},
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe('incrementView', () => {
	it('calls the increment_blog_view RPC with the slug', async () => {
		vi.mocked(baseService.rpc).mockResolvedValue({ data: null, error: null });

		const result = await viewsService.incrementView('my-post');

		expect(baseService.rpc).toHaveBeenCalledWith('increment_blog_view', {
			post_slug: 'my-post',
		});
		expect(result.error).toBeNull();
	});

	it('propagates RPC errors', async () => {
		const error = { message: 'rpc failed' };
		vi.mocked(baseService.rpc).mockResolvedValue({ data: null, error });

		const result = await viewsService.incrementView('my-post');

		expect(result.error).toBe(error);
	});
});

describe('getViewCount', () => {
	it('returns the view count for an existing slug', async () => {
		vi.mocked(baseService.get).mockResolvedValue({
			data: [{ slug: 'my-post', view_count: 42, updated_at: '' }],
			error: null,
		});

		const result = await viewsService.getViewCount('my-post');

		expect(baseService.get).toHaveBeenCalledWith(
			'blog_views',
			{ slug: 'my-post' },
			{ select: 'slug,view_count' }
		);
		expect(result.data).toBe(42);
	});

	it('returns 0 when the slug has no row yet', async () => {
		vi.mocked(baseService.get).mockResolvedValue({ data: [], error: null });

		const result = await viewsService.getViewCount('new-post');

		expect(result.data).toBe(0);
		expect(result.error).toBeNull();
	});
});

describe('getTopViewed', () => {
	it('maps rows to camelCase ordered by view_count', async () => {
		vi.mocked(baseService.get).mockResolvedValue({
			data: [
				{ slug: 'a', view_count: 10, updated_at: '' },
				{ slug: 'b', view_count: 5, updated_at: '' },
			],
			error: null,
		});

		const result = await viewsService.getTopViewed(2);

		expect(baseService.get).toHaveBeenCalledWith('blog_views', undefined, {
			select: 'slug,view_count',
			orderBy: { column: 'view_count', ascending: false },
			limit: 2,
		});
		expect(result.data).toEqual([
			{ slug: 'a', viewCount: 10 },
			{ slug: 'b', viewCount: 5 },
		]);
	});
});
