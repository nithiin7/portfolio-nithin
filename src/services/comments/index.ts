import { baseService } from 'services/index';
import type {
	Comment,
	CommentFormData,
	DatabaseComment,
	DatabaseCommentCreate,
} from 'types/comment';
import type { ServiceResponse } from 'types/service';

const COMMENT_COLUMNS =
	'id,post_id,author_name,content,parent_id,created_at,updated_at';

/** Blog comments in Supabase. */
export class CommentsService {
	private readonly tableName = 'comments';

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

	/** Comments on a post, oldest first. */
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

	/** Saves a comment with the given approval state. */
	async createComment(
		commentData: CommentFormData & { postId: string; isApproved: boolean }
	): Promise<ServiceResponse<Comment>> {
		try {
			const dbData = this.transformToDatabase(commentData);

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

	/** Total number of comments. */
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
