import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseClient } from 'clients/supabase';

/**
 * Service error type
 */
type ServiceError = Error | string | unknown | null;

/**
 * Service response type
 */
interface ServiceResponse<T> {
	data: T | null;
	error: ServiceError;
}

/**
 * Generic filters type
 */
type Filters = Record<string, string | number | boolean | null | undefined>;

/**
 * Generic data type for database operations - accepts any DTO shape
 * (e.g. `DatabaseCommentCreate`) without requiring an index signature
 */
type DatabaseData = object;

/**
 * Supabase query builder returned by `client.from(table).select(...)`,
 * used as the input/output of a query transformation callback
 */
type SupabaseQueryBuilder = ReturnType<
	ReturnType<SupabaseClient['from']>['select']
>;

/**
 * Query builder function type
 */
type QueryBuilder = (query: SupabaseQueryBuilder) => SupabaseQueryBuilder;

/**
 * Base service class providing generic CRUD operations for Supabase tables
 */
export class BaseService {
	protected get client(): SupabaseClient {
		return getSupabaseClient();
	}

	/**
	 * Generic GET operation with optional filters
	 */
	async get<T = unknown>(
		table: string,
		filters?: Filters,
		options?: {
			orderBy?: { column: string; ascending?: boolean };
			limit?: number;
			select?: string;
		}
	): Promise<ServiceResponse<T[]>> {
		try {
			let query = this.client.from(table).select(options?.select || '*');

			// Apply filters
			if (filters) {
				Object.entries(filters).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						query = query.eq(key, value);
					}
				});
			}

			// Apply ordering
			if (options?.orderBy) {
				query = query.order(options.orderBy.column, {
					ascending: options.orderBy.ascending ?? true,
				});
			}

			// Apply limit
			if (options?.limit) {
				query = query.limit(options.limit);
			}

			const { data, error } = await query;

			return { data: error ? null : (data as T[]), error };
		} catch (error) {
			console.error(`Error in BaseService.get for table ${table}:`, error);
			return { data: null, error };
		}
	}

	/**
	 * Generic GET operation for a single record by ID
	 */
	async getById<T = unknown>(
		table: string,
		id: string,
		select?: string
	): Promise<ServiceResponse<T>> {
		try {
			const { data, error } = await this.client
				.from(table)
				.select(select || '*')
				.eq('id', id)
				.single();

			return { data: error ? null : (data as T), error };
		} catch (error) {
			console.error(`Error in BaseService.getById for table ${table}:`, error);
			return { data: null, error };
		}
	}

	/**
	 * Generic POST operation for creating new records.
	 * Pass `select: false` when the anon role cannot read the row back
	 * (column-level grants / RLS block INSERT ... RETURNING).
	 */
	async post<T = unknown>(
		table: string,
		data: DatabaseData,
		options?: { select?: string | false }
	): Promise<ServiceResponse<T>> {
		try {
			const insert = this.client.from(table).insert(data);

			if (options?.select === false) {
				const { error } = await insert;
				return { data: null, error };
			}

			const { data: result, error } = await insert
				.select(options?.select || '*')
				.single();

			return { data: error ? null : (result as T), error };
		} catch (error) {
			console.error(`Error in BaseService.post for table ${table}:`, error);
			return { data: null, error };
		}
	}

	/**
	 * Generic PUT operation for full updates
	 */
	async put<T = unknown>(
		table: string,
		id: string,
		data: DatabaseData
	): Promise<ServiceResponse<T>> {
		try {
			const { data: result, error } = await this.client
				.from(table)
				.update(data)
				.eq('id', id)
				.select()
				.single();

			return { data: result, error };
		} catch (error) {
			console.error(`Error in BaseService.put for table ${table}:`, error);
			return { data: null, error };
		}
	}

	/**
	 * Generic PATCH operation for partial updates
	 */
	async patch<T = unknown>(
		table: string,
		id: string,
		data: DatabaseData
	): Promise<ServiceResponse<T>> {
		try {
			const { data: result, error } = await this.client
				.from(table)
				.update(data)
				.eq('id', id)
				.select()
				.single();

			return { data: result, error };
		} catch (error) {
			console.error(`Error in BaseService.patch for table ${table}:`, error);
			return { data: null, error };
		}
	}

	/**
	 * Generic DELETE operation
	 */
	async delete(table: string, id: string): Promise<{ error: ServiceError }> {
		try {
			const { error } = await this.client.from(table).delete().eq('id', id);

			return { error };
		} catch (error) {
			console.error(`Error in BaseService.delete for table ${table}:`, error);
			return { error };
		}
	}

	/**
	 * Generic RPC call for Postgres functions
	 */
	async rpc<T = unknown>(
		fn: string,
		args?: Record<string, unknown>
	): Promise<ServiceResponse<T>> {
		try {
			const { data, error } = await this.client.rpc(fn, args);

			return { data: error ? null : (data as T), error };
		} catch (error) {
			console.error(`Error in BaseService.rpc for function ${fn}:`, error);
			return { data: null, error };
		}
	}

	/**
	 * Generic query operation for complex queries
	 */
	async query<T = unknown>(
		table: string,
		queryBuilder: QueryBuilder
	): Promise<ServiceResponse<T[]>> {
		try {
			let query = this.client.from(table).select('*');
			query = queryBuilder(query);

			const { data, error } = await query;

			return { data, error };
		} catch (error) {
			console.error(`Error in BaseService.query for table ${table}:`, error);
			return { data: null, error };
		}
	}
}

export const baseService = new BaseService();
