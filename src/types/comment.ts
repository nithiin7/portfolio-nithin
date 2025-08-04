export interface Comment {
	id: string;
	postId: string;
	authorName: string;
	authorEmail: string;
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
}

export interface CommentSectionProps {
	postId: string;
	postSlug: string;
	className?: string;
}
