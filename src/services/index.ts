import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseClient } from 'clients/supabase';

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
	async get<T = any>(
		table: string,
		filters?: Record<string, any>,
		options?: {
			orderBy?: { column: string; ascending?: boolean };
			limit?: number;
			select?: string;
		}
	): Promise<{ data: T[] | null; error: any }> {
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
	async getById<T = any>(
		table: string,
		id: string,
		select?: string
	): Promise<{ data: T | null; error: any }> {
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
	 * Generic POST operation for creating new records
	 */
	async post<T = any>(
		table: string,
		data: Record<string, any>
	): Promise<{ data: T | null; error: any }> {
		try {
			const { data: result, error } = await this.client
				.from(table)
				.insert(data)
				.select()
				.single();

			return { data: result, error };
		} catch (error) {
			console.error(`Error in BaseService.post for table ${table}:`, error);
			return { data: null, error };
		}
	}

	/**
	 * Generic PUT operation for full updates
	 */
	async put<T = any>(
		table: string,
		id: string,
		data: Record<string, any>
	): Promise<{ data: T | null; error: any }> {
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
	async patch<T = any>(
		table: string,
		id: string,
		data: Record<string, any>
	): Promise<{ data: T | null; error: any }> {
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
	async delete(table: string, id: string): Promise<{ error: any }> {
		try {
			const { error } = await this.client.from(table).delete().eq('id', id);

			return { error };
		} catch (error) {
			console.error(`Error in BaseService.delete for table ${table}:`, error);
			return { error };
		}
	}

	/**
	 * Generic query operation for complex queries
	 */
	async query<T = any>(
		table: string,
		queryBuilder: (query: any) => any
	): Promise<{ data: T[] | null; error: any }> {
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

// Export a singleton instance
export const baseService = new BaseService();
