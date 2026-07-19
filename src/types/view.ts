export interface DatabaseBlogView {
	slug: string;
	view_count: number;
	updated_at: string;
}

export interface BlogView {
	slug: string;
	viewCount: number;
}

export type ServiceError = Error | string | unknown | null;

export interface ServiceResponse<T> {
	data: T | null;
	error: ServiceError;
}
