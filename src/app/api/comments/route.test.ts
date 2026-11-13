// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET, POST } from 'app/api/comments/route';
import { commentsService } from 'services/comments';
import { apiRequest, freshIp, recaptchaResponse } from 'test/api';

vi.mock('services/comments', () => ({
	commentsService: {
		getCommentsByPostId: vi.fn(),
		createComment: vi.fn(),
	},
}));

const body = {
	postId: 'post-1',
	authorName: 'Ada',
	authorEmail: 'ada@example.com',
	content: 'A thoughtful comment.',
	recaptchaToken: 'token',
};

const post = (payload: unknown, ip?: string) =>
	POST(apiRequest('/api/comments', { method: 'POST', body: payload, ip }));

beforeEach(() => {
	vi.clearAllMocks();
	vi.stubEnv('RECAPTCHA_SECRET_KEY', 'secret');
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue(recaptchaResponse(0.9)));
	vi.spyOn(console, 'error').mockImplementation(() => {});
	vi.mocked(commentsService.createComment).mockImplementation(async (data) => ({
		data: {
			id: 'c1',
			postId: data.postId,
			authorName: data.authorName,
			content: data.content,
			createdAt: 'now',
		},
		error: null,
	}));
});

describe('GET /api/comments', () => {
	it('requires a postId', async () => {
		const res = await GET(apiRequest('/api/comments'));

		expect(res.status).toBe(400);
		await expect(res.json()).resolves.toEqual({
			error: 'Post ID is required',
		});
	});

	it('returns the post’s comments, or an empty list on error', async () => {
		vi.mocked(commentsService.getCommentsByPostId)
			.mockResolvedValueOnce({ data: [], error: null })
			.mockResolvedValueOnce({ data: null, error: new Error('db') });

		const ok = await GET(apiRequest('/api/comments?postId=p'));
		const failed = await GET(apiRequest('/api/comments?postId=p'));

		await expect(ok.json()).resolves.toEqual({ comments: [] });
		await expect(failed.json()).resolves.toEqual({ comments: [] });
	});
});

describe('POST /api/comments', () => {
	it('creates an approved comment for a high reCAPTCHA score', async () => {
		const res = await post(body);

		expect(res.status).toBe(201);
		await expect(res.json()).resolves.toMatchObject({ pending: false });
		expect(commentsService.createComment).toHaveBeenCalledWith({
			postId: 'post-1',
			authorName: 'Ada',
			authorEmail: 'ada@example.com',
			content: 'A thoughtful comment.',
			parentId: undefined,
			isApproved: true,
		});
	});

	it('holds mid-score comments for moderation', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(recaptchaResponse(0.6)));

		const res = await post(body);

		await expect(res.json()).resolves.toMatchObject({ pending: true });
	});

	it('rejects a failed reCAPTCHA', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(recaptchaResponse(0.2)));

		const res = await post(body);

		expect(res.status).toBe(400);
		await expect(res.json()).resolves.toEqual({
			error: 'reCAPTCHA verification failed',
		});
		expect(commentsService.createComment).not.toHaveBeenCalled();
	});

	it.each([
		[{ ...body, authorEmail: 'nope' }, 'Please enter a valid email address'],
		[{ ...body, content: 'short' }, 'Comment must be at least 10 characters'],
		[{ ...body, postId: undefined }, 'Post ID is required'],
		[{ ...body, recaptchaToken: undefined }, 'reCAPTCHA verification failed'],
	])('validates the body (%#)', async (payload, error) => {
		const res = await post(payload);

		expect(res.status).toBe(400);
		await expect(res.json()).resolves.toEqual({ error });
	});

	it('never forwards unknown fields such as isApproved', async () => {
		await post({ ...body, isApproved: true, score: 1 });

		expect(
			Object.keys(vi.mocked(commentsService.createComment).mock.calls[0]![0])
		).not.toContain('score');
	});

	it('answers 500 when the insert fails', async () => {
		vi.mocked(commentsService.createComment).mockResolvedValueOnce({
			data: null,
			error: new Error('db'),
		});

		const res = await post(body);

		expect(res.status).toBe(500);
		await expect(res.json()).resolves.toEqual({
			error: 'Failed to create comment',
		});
	});

	it('rate-limits after 5 comments per IP', async () => {
		const ip = freshIp();
		for (let i = 0; i < 5; i++) await post(body, ip);

		expect((await post(body, ip)).status).toBe(429);
	});
});
