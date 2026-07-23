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

// Columns the anon role can SELECT — `*` fails because author_email is
// excluded via column-level grants (migrations/supabase-security-fix.sql)
const COMMENT_COLUMNS =
	'id,post_id,author_name,content,parent_id,created_at,updated_at';

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
			id: crypto.randomUUID(),
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
					select: COMMENT_COLUMNS,
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
				id,
				COMMENT_COLUMNS
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

			// No INSERT ... RETURNING: unapproved rows fail the moderation RLS
			// SELECT policy, so the row is built locally from a client-generated id
			const { error } = await baseService.post(this.tableName, dbData, {
				select: false,
			});

			if (error) {
				return { data: null, error };
			}

			const now = new Date().toISOString();
			return {
				data: {
					id: dbData.id,
					postId: dbData.post_id,
					authorName: dbData.author_name,
					content: dbData.content,
					createdAt: now,
					updatedAt: now,
					parentId: dbData.parent_id || undefined,
				},
				error: null,
			};
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
	 * Get comment counts for a batch of posts, keyed by post ID. Counts
	 * top-level comments and replies together; posts with no comments are
	 * absent from the result — callers should default missing IDs to 0.
	 */
	async getCommentCounts(
		postIds: string[]
	): Promise<ServiceResponse<Record<string, number>>> {
		try {
			const { data, error } = await baseService.getWhereIn<
				Pick<DatabaseComment, 'post_id'>
			>(this.tableName, 'post_id', postIds, { select: 'post_id' });

			if (error) {
				return { data: null, error };
			}

			const counts = (data ?? []).reduce<Record<string, number>>(
				(acc, comment) => {
					acc[comment.post_id] = (acc[comment.post_id] ?? 0) + 1;
					return acc;
				},
				{}
			);
			return { data: counts, error: null };
		} catch (error) {
			console.error('Error in CommentsService.getCommentCounts:', error);
			return { data: null, error };
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
					select: COMMENT_COLUMNS,
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
