import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
	createRateLimiter,
	jsonError,
	parseJsonBody,
	tooManyRequests,
	verifyRecaptcha,
} from 'helpers/apiProtection';
import { commentRequestSchema } from 'helpers/validations';
import { commentsService } from 'services/comments';

const isRateLimited = createRateLimiter({
	max: 5,
	windowMs: 10 * 60 * 1000,
});

// Lower-scoring comments are stored unapproved and wait for moderation
const AUTO_APPROVE_SCORE = 0.8;

/** Comments on a post. */
export async function GET(request: NextRequest) {
	const postId = request.nextUrl.searchParams.get('postId');

	if (!postId) return jsonError(400, 'Post ID is required');

	try {
		const { data: comments, error } =
			await commentsService.getCommentsByPostId(postId);
		return NextResponse.json({ comments: error ? [] : (comments ?? []) });
	} catch {
		return NextResponse.json({ comments: [] });
	}
}

/** Adds a comment after the reCAPTCHA check. */
export async function POST(request: NextRequest) {
	if (isRateLimited(request.headers)) return tooManyRequests();

	try {
		const { data, response } = await parseJsonBody(
			request,
			commentRequestSchema
		);
		if (response) return response;

		const recaptcha = await verifyRecaptcha(data.recaptchaToken);
		if (!recaptcha.valid)
			return jsonError(400, 'reCAPTCHA verification failed');

		const isApproved = recaptcha.score >= AUTO_APPROVE_SCORE;

		const { data: newComment, error } = await commentsService.createComment({
			postId: data.postId,
			authorName: data.authorName,
			authorEmail: data.authorEmail,
			content: data.content,
			parentId: data.parentId,
			isApproved,
		});

		if (error || !newComment) {
			console.error('Error creating comment:', error);
			return jsonError(500, 'Failed to create comment');
		}

		return NextResponse.json(
			{ comment: newComment, pending: !isApproved },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating comment:', error);
		return jsonError(500, 'Internal server error');
	}
}
