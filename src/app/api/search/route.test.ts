// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

import { GET } from 'app/api/search/route';
import { loadBlogPosts, loadWork } from 'helpers/contentful';

vi.mock('helpers/contentful', () => ({
	loadBlogPosts: vi.fn(),
	loadWork: vi.fn(),
}));

describe('GET /api/search', () => {
	it('returns titles and slugs for posts and projects', async () => {
		vi.mocked(loadBlogPosts).mockResolvedValue([
			{ title: 'What is MCP', slug: 'what-is-mcp' },
		] as Awaited<ReturnType<typeof loadBlogPosts>>);
		vi.mocked(loadWork).mockResolvedValue([
			{ title: 'Orbit', slug: 'orbit', image: { url: '' }, tech: [] },
		] as Awaited<ReturnType<typeof loadWork>>);

		const res = await GET();

		await expect(res.json()).resolves.toEqual({
			blogPosts: [{ title: 'What is MCP', slug: 'what-is-mcp' }],
			portfolioItems: [{ title: 'Orbit', slug: 'orbit' }],
		});
	});
});
