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
	is_approved: boolean;
}

/**
 * Database comment creation interface (id generated client-side, no timestamps)
 */
export interface DatabaseCommentCreate {
	id: string;
	post_id: string;
	author_name: string;
	author_email: string;
	content: string;
	parent_id: string | null;
	is_approved: boolean;
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
