export interface Comment {
	id: string;
	postId: string;
	authorName: string;
	authorEmail?: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
	replies?: Comment[];
	parentId?: string;
}

export interface CommentFormData {
	authorName: string;
	authorEmail: string;
	content: string;
	parentId?: string;
	recaptchaToken?: string;
}

export interface CommentSectionProps {
	postId: string;
	postSlug: string;
	className?: string;
}

/**
 * Database comment interface (snake_case columns)
 */
export interface DatabaseComment {
	id: string;
	post_id: string;
	author_name: string;
	author_email: string;
	content: string;
	parent_id: string | null;
	created_at: string;
	updated_at: string;
}

/**
 * Database comment creation interface (without id and timestamps)
 */
export interface DatabaseCommentCreate {
	post_id: string;
	author_name: string;
	author_email: string;
	content: string;
	parent_id: string | null;
}

/**
 * Database comment update interface (partial fields)
 */
export interface DatabaseCommentUpdate {
	author_name?: string;
	author_email?: string;
	content?: string;
}

/**
 * Service error type
 */
export type ServiceError = Error | string | unknown | null;

/**
 * Service response type
 */
export interface ServiceResponse<T> {
	data: T | null;
	error: ServiceError;
}
