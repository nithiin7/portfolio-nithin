import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseClient } from 'clients/supabase';
import type { ServiceResponse } from 'types/service';

type Filters = Record<string, string | number | boolean | null | undefined>;

/** Supabase table wrapper that answers with `{ data, error }`. */
export class BaseService {
	protected get client(): SupabaseClient {
		return getSupabaseClient();
	}

	/** Selects rows matching the filters. */
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

			if (filters) {
				Object.entries(filters).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						query = query.eq(key, value);
					}
				});
			}

			if (options?.orderBy) {
				query = query.order(options.orderBy.column, {
					ascending: options.orderBy.ascending ?? true,
				});
			}

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

	/** Inserts a row. */
	async post<T = unknown>(
		table: string,
		data: object,
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

	/** Updates rows matching the filters. */
	async patch<T = unknown>(
		table: string,
		id: string,
		data: object
	): Promise<ServiceResponse<T>> {
		try {
			const { data: result, error } = await this.client
				.from(table)
				.update(data)
				.eq('id', id)
				.select()
				.single();

			return { data: result as T | null, error };
		} catch (error) {
			console.error(`Error in BaseService.patch for table ${table}:`, error);
			return { data: null, error };
		}
	}

	/** Calls a Postgres function. */
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
}

export const baseService = new BaseService();
