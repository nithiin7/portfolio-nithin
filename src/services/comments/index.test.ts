import { beforeEach, describe, expect, it, vi } from 'vitest';

import { commentsService } from 'services/comments';
import { baseService } from 'services/index';
import type { DatabaseComment } from 'types/comment';

vi.mock('services/index', () => ({
	baseService: {
		get: vi.fn(),
		getById: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
		getWhereIn: vi.fn(),
	},
}));

const dbComment = (overrides: Partial<DatabaseComment>): DatabaseComment => ({
	id: 'c1',
	post_id: 'post-1',
	author_name: 'Nithin',
	author_email: 'n@example.com',
	content: 'Nice post!',
	parent_id: null,
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
	is_approved: true,
	...overrides,
});

beforeEach(() => {
	vi.clearAllMocks();
});

describe('getCommentsByPostId', () => {
	it('filters by post_id and maps snake_case rows to camelCase', async () => {
		vi.mocked(baseService.get).mockResolvedValue({
			data: [dbComment({})],
			error: null,
		});

		const result = await commentsService.getCommentsByPostId('post-1');

		expect(baseService.get).toHaveBeenCalledWith(
			'comments',
			{ post_id: 'post-1' },
			{
				orderBy: { column: 'created_at', ascending: true },
				select:
					'id,post_id,author_name,content,parent_id,created_at,updated_at',
			}
		);
		expect(result.data).toEqual([
			{
				id: 'c1',
				postId: 'post-1',
				authorName: 'Nithin',
				content: 'Nice post!',
				createdAt: '2026-01-01T00:00:00Z',
				updatedAt: '2026-01-01T00:00:00Z',
				parentId: undefined,
			},
		]);
	});

	it('propagates errors without transforming', async () => {
		const error = { message: 'network down' };
		vi.mocked(baseService.get).mockResolvedValue({ data: null, error });

		const result = await commentsService.getCommentsByPostId('post-1');

		expect(result).toEqual({ data: null, error });
	});
});

describe('getCommentCounts', () => {
	it('returns a post-id-keyed map counting rows including replies', async () => {
		vi.mocked(baseService.getWhereIn).mockResolvedValue({
			data: [
				{ post_id: 'post-1' },
				{ post_id: 'post-1' },
				{ post_id: 'post-2' },
			],
			error: null,
		});

		const result = await commentsService.getCommentCounts(['post-1', 'post-2']);

		expect(baseService.getWhereIn).toHaveBeenCalledWith(
			'comments',
			'post_id',
			['post-1', 'post-2'],
			{ select: 'post_id' }
		);
		expect(result.data).toEqual({ 'post-1': 2, 'post-2': 1 });
	});

	it('omits posts with no comments', async () => {
		vi.mocked(baseService.getWhereIn).mockResolvedValue({
			data: [],
			error: null,
		});

		const result = await commentsService.getCommentCounts(['post-1']);

		expect(result.data).toEqual({});
	});
});

describe('createComment', () => {
	const formData = {
		authorName: 'Nithin',
		authorEmail: 'n@example.com',
		content: 'Great write-up!',
		postId: 'post-1',
		isApproved: false,
	};

	it('inserts a snake_case row without RETURNING and builds the comment locally', async () => {
		vi.mocked(baseService.post).mockResolvedValue({ data: null, error: null });

		const result = await commentsService.createComment(formData);

		const [table, payload, options] = vi.mocked(baseService.post).mock
			.calls[0] as [string, Record<string, unknown>, { select: boolean }];

		expect(table).toBe('comments');
		expect(options).toEqual({ select: false });
		expect(payload).toMatchObject({
			post_id: 'post-1',
			author_name: 'Nithin',
			author_email: 'n@example.com',
			content: 'Great write-up!',
			parent_id: null,
			is_approved: false,
		});
		expect(result.data).toMatchObject({
			id: payload.id,
			postId: 'post-1',
			authorName: 'Nithin',
			content: 'Great write-up!',
			parentId: undefined,
		});
		expect(result.error).toBeNull();
	});

	it('returns the insert error and no data on failure', async () => {
		const error = { message: 'rls violation' };
		vi.mocked(baseService.post).mockResolvedValue({ data: null, error });

		const result = await commentsService.createComment(formData);

		expect(result).toEqual({ data: null, error });
	});
});

describe('getCommentsWithReplies', () => {
	it('nests replies under their parent comments', async () => {
		vi.mocked(baseService.get).mockResolvedValue({
			data: [
				dbComment({ id: 'parent-1' }),
				dbComment({ id: 'reply-1', parent_id: 'parent-1' }),
				dbComment({ id: 'parent-2' }),
			],
			error: null,
		});

		const result = await commentsService.getCommentsWithReplies('post-1');

		expect(result.data).toHaveLength(2);
		expect(result.data?.[0]).toMatchObject({
			id: 'parent-1',
			replies: [expect.objectContaining({ id: 'reply-1' })],
		});
		expect(result.data?.[1]).toMatchObject({ id: 'parent-2', replies: [] });
	});
});

describe('deleteComment', () => {
	it('delegates to baseService.delete', async () => {
		vi.mocked(baseService.delete).mockResolvedValue({ error: null });

		const result = await commentsService.deleteComment('c1');

		expect(baseService.delete).toHaveBeenCalledWith('comments', 'c1');
		expect(result).toEqual({ error: null });
	});
});
