import { baseService } from 'services/index';
import type {
	Comment,
	CommentFormData,
	DatabaseComment,
	DatabaseCommentCreate,
	DatabaseCommentUpdate,
	ServiceError,
	ServiceResponse,
} from 'types/comment';

/**
 * Comments service providing comment-specific operations
 */
export class CommentsService {
	private readonly tableName = 'comments';

	/**
	 * Transform database comment to Comment interface
	 */
	private transformComment(dbComment: DatabaseComment): Comment {
		return {
			id: dbComment.id,
			postId: dbComment.post_id,
			authorName: dbComment.author_name,
			content: dbComment.content,
			createdAt: dbComment.created_at,
			updatedAt: dbComment.updated_at,
			parentId: dbComment.parent_id || undefined,
		};
	}

	/**
	 * Transform Comment interface to database format
	 */
	private transformToDatabase(
		comment: CommentFormData & { postId: string; isApproved: boolean }
	): DatabaseCommentCreate {
		return {
			post_id: comment.postId,
			author_name: comment.authorName,
			author_email: comment.authorEmail,
			content: comment.content,
			parent_id: comment.parentId || null,
			is_approved: comment.isApproved,
		};
	}

	/**
	 * Get all comments for a specific post
	 */
	async getCommentsByPostId(
		postId: string
	): Promise<ServiceResponse<Comment[]>> {
		try {
			const { data, error } = await baseService.get<DatabaseComment>(
				this.tableName,
				{ post_id: postId },
				{
					orderBy: { column: 'created_at', ascending: true },
				}
			);

			if (error) {
				return { data: null, error };
			}

			const transformedComments =
				data?.map((comment) => this.transformComment(comment)) || [];
			return { data: transformedComments, error: null };
		} catch (error) {
			console.error('Error in CommentsService.getCommentsByPostId:', error);
			return { data: null, error };
		}
	}

	/**
	 * Get a single comment by ID
	 */
	async getCommentById(id: string): Promise<ServiceResponse<Comment>> {
		try {
			const { data, error } = await baseService.getById<DatabaseComment>(
				this.tableName,
				id
			);

			if (error || !data) {
				return { data: null, error };
			}

			const transformedComment = this.transformComment(data);
			return { data: transformedComment, error: null };
		} catch (error) {
			console.error('Error in CommentsService.getCommentById:', error);
			return { data: null, error };
		}
	}

	/**
	 * Create a new comment
	 */
	async createComment(
		commentData: CommentFormData & { postId: string; isApproved: boolean }
	): Promise<ServiceResponse<Comment>> {
		try {
			const dbData = this.transformToDatabase(commentData);

			const { data, error } = await baseService.post<DatabaseComment>(
				this.tableName,
				dbData
			);

			if (error || !data) {
				return { data: null, error };
			}

			const transformedComment = this.transformComment(data);
			return { data: transformedComment, error: null };
		} catch (error) {
			console.error('Error in CommentsService.createComment:', error);
			return { data: null, error };
		}
	}

	/**
	 * Update an existing comment
	 */
	async updateComment(
		id: string,
		commentData: Partial<CommentFormData>
	): Promise<ServiceResponse<Comment>> {
		try {
			const updateData: DatabaseCommentUpdate = {};

			if (commentData.authorName !== undefined) {
				updateData.author_name = commentData.authorName;
			}
			if (commentData.authorEmail !== undefined) {
				updateData.author_email = commentData.authorEmail;
			}
			if (commentData.content !== undefined) {
				updateData.content = commentData.content;
			}

			const { data, error } = await baseService.patch<DatabaseComment>(
				this.tableName,
				id,
				updateData
			);

			if (error || !data) {
				return { data: null, error };
			}

			const transformedComment = this.transformComment(data);
			return { data: transformedComment, error: null };
		} catch (error) {
			console.error('Error in CommentsService.updateComment:', error);
			return { data: null, error };
		}
	}

	/**
	 * Delete a comment
	 */
	async deleteComment(id: string): Promise<{ error: ServiceError }> {
		try {
			const { error } = await baseService.delete(this.tableName, id);
			return { error };
		} catch (error) {
			console.error('Error in CommentsService.deleteComment:', error);
			return { error };
		}
	}

	/**
	 * Get replies for a specific comment
	 */
	async getReplies(parentId: string): Promise<ServiceResponse<Comment[]>> {
		try {
			const { data, error } = await baseService.get<DatabaseComment>(
				this.tableName,
				{ parent_id: parentId },
				{
					orderBy: { column: 'created_at', ascending: true },
				}
			);

			if (error) {
				return { data: null, error };
			}

			const transformedComments =
				data?.map((comment) => this.transformComment(comment)) || [];
			return { data: transformedComments, error: null };
		} catch (error) {
			console.error('Error in CommentsService.getReplies:', error);
			return { data: null, error };
		}
	}

	/**
	 * Get comments with their replies (nested structure)
	 */
	async getCommentsWithReplies(
		postId: string
	): Promise<ServiceResponse<Comment[]>> {
		try {
			// Get all comments for the post
			const { data: allComments, error } =
				await this.getCommentsByPostId(postId);

			if (error || !allComments) {
				return { data: null, error };
			}

			// Separate top-level comments and replies
			const topLevelComments = allComments.filter(
				(comment) => !comment.parentId
			);
			const replies = allComments.filter((comment) => comment.parentId);

			// Group replies by parent comment
			const repliesByParent = replies.reduce(
				(acc, reply) => {
					const parentId = reply.parentId!;
					if (!acc[parentId]) {
						acc[parentId] = [];
					}
					acc[parentId].push(reply);
					return acc;
				},
				{} as Record<string, Comment[]>
			);

			// Attach replies to their parent comments
			const commentsWithReplies = topLevelComments.map((comment) => ({
				...comment,
				replies: repliesByParent[comment.id] || [],
			}));

			return { data: commentsWithReplies, error: null };
		} catch (error) {
			console.error('Error in CommentsService.getCommentsWithReplies:', error);
			return { data: null, error };
		}
	}
}

// Export a singleton instance
export const commentsService = new CommentsService();
