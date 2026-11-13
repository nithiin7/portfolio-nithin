/** Supabase/Postgrest errors pass through as-is; callers check truthiness or `code`. */
export type ServiceError = unknown;

export interface ServiceResponse<T> {
	data: T | null;
	error: ServiceError;
}
