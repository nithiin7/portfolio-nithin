import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSupabaseClient } from 'clients/supabase';
import { baseService } from 'services/index';

vi.mock('clients/supabase', () => ({
	getSupabaseClient: vi.fn(),
}));

interface QueryResult {
	data?: unknown;
	error?: unknown;
}

/**
 * Chainable thenable mimicking the Supabase query builder
 */
const createQueryMock = (result: QueryResult) => {
	const query: {
		select: ReturnType<typeof vi.fn>;
		eq: ReturnType<typeof vi.fn>;
		order: ReturnType<typeof vi.fn>;
		limit: ReturnType<typeof vi.fn>;
		single: ReturnType<typeof vi.fn>;
		then: (
			resolve: (value: QueryResult) => unknown,
			reject: (reason: unknown) => unknown
		) => Promise<unknown>;
	} = {
		select: vi.fn(() => query),
		eq: vi.fn(() => query),
		order: vi.fn(() => query),
		limit: vi.fn(() => query),
		single: vi.fn(() => Promise.resolve(result)),
		then: (
			resolve: (value: QueryResult) => unknown,
			reject: (reason: unknown) => unknown
		) => Promise.resolve(result).then(resolve, reject),
	};
	return query;
};

const createClientMock = (result: QueryResult) => {
	const query = createQueryMock(result);
	const table = {
		select: vi.fn(() => query),
		insert: vi.fn(() => query),
		update: vi.fn(() => query),
		delete: vi.fn(() => query),
	};
	const client = { from: vi.fn(() => table) };

	vi.mocked(getSupabaseClient).mockReturnValue(
		client as unknown as ReturnType<typeof getSupabaseClient>
	);

	return { client, table, query };
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('BaseService.get', () => {
	it('applies filters, ordering, limit, and column selection', async () => {
		const rows = [{ id: '1' }];
		const { client, table, query } = createClientMock({
			data: rows,
			error: null,
		});

		const result = await baseService.get(
			'comments',
			{ post_id: 'abc', skipped: undefined, alsoSkipped: null },
			{
				orderBy: { column: 'created_at', ascending: false },
				limit: 10,
				select: 'id,content',
			}
		);

		expect(client.from).toHaveBeenCalledWith('comments');
		expect(table.select).toHaveBeenCalledWith('id,content');
		expect(query.eq).toHaveBeenCalledTimes(1);
		expect(query.eq).toHaveBeenCalledWith('post_id', 'abc');
		expect(query.order).toHaveBeenCalledWith('created_at', {
			ascending: false,
		});
		expect(query.limit).toHaveBeenCalledWith(10);
		expect(result).toEqual({ data: rows, error: null });
	});

	it('defaults to selecting all columns with no filters', async () => {
		const { table, query } = createClientMock({ data: [], error: null });

		await baseService.get('comments');

		expect(table.select).toHaveBeenCalledWith('*');
		expect(query.eq).not.toHaveBeenCalled();
	});

	it('returns null data when the query errors', async () => {
		const error = { message: 'permission denied' };
		createClientMock({ data: [{ id: '1' }], error });

		const result = await baseService.get('comments');

		expect(result).toEqual({ data: null, error });
	});
});

describe('BaseService.getById', () => {
	it('queries a single record by id', async () => {
		const row = { id: '1' };
		const { query } = createClientMock({ data: row, error: null });

		const result = await baseService.getById('comments', '1');

		expect(query.eq).toHaveBeenCalledWith('id', '1');
		expect(query.single).toHaveBeenCalled();
		expect(result).toEqual({ data: row, error: null });
	});
});

describe('BaseService.post', () => {
	it('inserts and returns the created row by default', async () => {
		const row = { id: '1', content: 'hi' };
		const { table, query } = createClientMock({ data: row, error: null });

		const result = await baseService.post('comments', { content: 'hi' });

		expect(table.insert).toHaveBeenCalledWith({ content: 'hi' });
		expect(query.single).toHaveBeenCalled();
		expect(result).toEqual({ data: row, error: null });
	});

	it('skips INSERT ... RETURNING when select is false', async () => {
		const { table, query } = createClientMock({ error: null });

		const result = await baseService.post(
			'comments',
			{ content: 'hi' },
			{ select: false }
		);

		expect(table.insert).toHaveBeenCalledWith({ content: 'hi' });
		expect(query.single).not.toHaveBeenCalled();
		expect(result).toEqual({ data: null, error: null });
	});
});

describe('BaseService.delete', () => {
	it('deletes by id', async () => {
		const { table, query } = createClientMock({ error: null });

		const result = await baseService.delete('comments', '1');

		expect(table.delete).toHaveBeenCalled();
		expect(query.eq).toHaveBeenCalledWith('id', '1');
		expect(result).toEqual({ error: null });
	});
});
