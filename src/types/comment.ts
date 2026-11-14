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

export interface DatabaseCommentCreate {
	id: string;
	post_id: string;
	author_name: string;
	author_email: string;
	content: string;
	parent_id: string | null;
	is_approved: boolean;
}
