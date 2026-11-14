export type ServiceError = unknown;

export interface ServiceResponse<T> {
	data: T | null;
	error: ServiceError;
}
