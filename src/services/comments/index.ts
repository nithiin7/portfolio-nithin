import { baseService } from 'services/index';
import type {
	Comment,
	CommentFormData,
	DatabaseComment,
	DatabaseCommentCreate,
} from 'types/comment';
import type { ServiceResponse } from 'types/service';

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
	 * Get the total number of comments across every post, for site-wide
	 * stats. RLS already restricts anon SELECT to approved rows, so this
	 * is naturally an approved-only count.
	 */
	async getTotalCommentCount(): Promise<ServiceResponse<number>> {
		try {
			const { data, error } = await baseService.get<
				Pick<DatabaseComment, 'id'>
			>(this.tableName, undefined, { select: 'id' });

			if (error) {
				return { data: null, error };
			}

			return { data: (data ?? []).length, error: null };
		} catch (error) {
			console.error('Error in CommentsService.getTotalCommentCount:', error);
			return { data: null, error };
		}
	}
}

export const commentsService = new CommentsService();
