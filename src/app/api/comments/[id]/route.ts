import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { commentsService } from 'services/comments';

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const { data: comment, error } = await commentsService.getCommentById(id);

		if (error) {
			console.error('Error fetching comment:', error);
			return NextResponse.json(
				{ error: 'Failed to fetch comment' },
				{ status: 500 }
			);
		}

		if (!comment) {
			return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
		}

		return NextResponse.json({ comment });
	} catch (error) {
		console.error('Error in GET /api/comments/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { authorName, authorEmail, content } = body;

		if (!authorName || !authorEmail || !content) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(authorEmail)) {
			return NextResponse.json(
				{ error: 'Invalid email format' },
				{ status: 400 }
			);
		}

		if (content.length < 1 || content.length > 1000) {
			return NextResponse.json(
				{ error: 'Comment must be between 1 and 1000 characters' },
				{ status: 400 }
			);
		}

		const { data: updatedComment, error } = await commentsService.updateComment(
			id,
			{ authorName, authorEmail, content }
		);

		if (error || !updatedComment) {
			console.error('Error updating comment:', error);
			return NextResponse.json(
				{ error: 'Failed to update comment' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ comment: updatedComment });
	} catch (error) {
		console.error('Error in PUT /api/comments/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const body = await request.json();

		if (Object.keys(body).length === 0) {
			return NextResponse.json(
				{ error: 'At least one field must be provided' },
				{ status: 400 }
			);
		}

		if (body.authorEmail) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(body.authorEmail)) {
				return NextResponse.json(
					{ error: 'Invalid email format' },
					{ status: 400 }
				);
			}
		}

		if (body.content) {
			if (body.content.length < 1 || body.content.length > 1000) {
				return NextResponse.json(
					{ error: 'Comment must be between 1 and 1000 characters' },
					{ status: 400 }
				);
			}
		}

		const { data: updatedComment, error } = await commentsService.updateComment(
			id,
			body
		);

		if (error || !updatedComment) {
			console.error('Error updating comment:', error);
			return NextResponse.json(
				{ error: 'Failed to update comment' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ comment: updatedComment });
	} catch (error) {
		console.error('Error in PATCH /api/comments/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const { error } = await commentsService.deleteComment(id);

		if (error) {
			console.error('Error deleting comment:', error);
			return NextResponse.json(
				{ error: 'Failed to delete comment' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error('Error in DELETE /api/comments/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
