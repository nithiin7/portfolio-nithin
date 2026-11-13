// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET, POST } from 'app/api/views/route';
import { viewsService } from 'services/views';
import { apiRequest, freshIp } from 'test/api';

vi.mock('services/views', () => ({
	viewsService: { getViewCount: vi.fn(), incrementView: vi.fn() },
}));

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(viewsService.incrementView).mockResolvedValue({ error: null });
});

describe('GET /api/views', () => {
	it('rejects missing or malformed slugs', async () => {
		expect((await GET(apiRequest('/api/views'))).status).toBe(400);
		expect((await GET(apiRequest('/api/views?slug=..%2Fx'))).status).toBe(400);
		expect(viewsService.getViewCount).not.toHaveBeenCalled();
	});

	it('returns the count, or 0 on error', async () => {
		vi.mocked(viewsService.getViewCount)
			.mockResolvedValueOnce({ data: 12, error: null })
			.mockResolvedValueOnce({ data: null, error: new Error('db') });

		await expect(
			(await GET(apiRequest('/api/views?slug=what-is-mcp'))).json()
		).resolves.toEqual({ viewCount: 12 });
		await expect(
			(await GET(apiRequest('/api/views?slug=what-is-mcp'))).json()
		).resolves.toEqual({ viewCount: 0 });
	});
});

describe('POST /api/views', () => {
	const post = (body: unknown, ip?: string) =>
		POST(apiRequest('/api/views', { method: 'POST', body, ip }));

	it('records a view for a valid slug', async () => {
		const res = await post({ slug: 'what-is-mcp' });

		expect(res.status).toBe(200);
		expect(viewsService.incrementView).toHaveBeenCalledWith('what-is-mcp');
	});

	it('validates the slug and the JSON', async () => {
		const bad = await post({ slug: 'Not A Slug' });
		expect(bad.status).toBe(400);
		await expect(bad.json()).resolves.toEqual({ error: 'Invalid slug' });

		expect((await post('{')).status).toBe(400);
		expect(viewsService.incrementView).not.toHaveBeenCalled();
	});

	it('answers 500 when the RPC fails', async () => {
		vi.mocked(viewsService.incrementView).mockResolvedValueOnce({
			error: new Error('rpc'),
		});

		expect((await post({ slug: 'what-is-mcp' })).status).toBe(500);
	});

	it('rate-limits after 60 views per IP', async () => {
		const ip = freshIp();
		for (let i = 0; i < 60; i++) await post({ slug: 'a' }, ip);

		expect((await post({ slug: 'a' }, ip)).status).toBe(429);
	});
});
