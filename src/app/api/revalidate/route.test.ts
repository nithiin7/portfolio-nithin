// @vitest-environment node
import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from 'app/api/revalidate/route';
import { apiRequest } from 'test/api';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

const webhook = (body: unknown, secret = 'hook-secret') =>
	POST(
		apiRequest('/api/revalidate', {
			method: 'POST',
			body,
			headers: { 'x-revalidate-secret': secret },
		})
	);

beforeEach(() => {
	vi.clearAllMocks();
	vi.stubEnv('CONTENTFUL_REVALIDATE_SECRET', 'hook-secret');
});

describe('POST /api/revalidate', () => {
	it('rejects a wrong or missing secret', async () => {
		const res = await webhook({}, 'wrong');

		expect(res.status).toBe(401);
		await expect(res.json()).resolves.toEqual({ error: 'Invalid secret' });

		vi.stubEnv('CONTENTFUL_REVALIDATE_SECRET', '');
		expect((await webhook({}, '')).status).toBe(401);
		expect(revalidatePath).not.toHaveBeenCalled();
	});

	it.each([
		['blogPost', undefined, ['/blog/[slug]', '/rss', '/sitemap.xml']],
		['portfolioDetails', undefined, ['/', '/portfolio/[slug]', '/sitemap.xml']],
		['page', 'home', ['/']],
		['page', 'contact', ['/contact']],
		['section', undefined, ['/']],
	])('revalidates %s (%s)', async (type, slug, paths) => {
		const res = await webhook({
			sys: { contentType: { sys: { id: type } } },
			fields: slug ? { slug: { 'en-US': slug } } : undefined,
		});

		await expect(res.json()).resolves.toMatchObject({ revalidated: paths });
	});

	it('revalidates the whole layout for an empty body', async () => {
		await webhook('');

		expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
	});
});
