import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createRateLimiter, verifyRecaptcha } from 'helpers/apiProtection';
import { commentsService } from 'services/comments';

const checkRateLimit = createRateLimiter({
	max: 5,
	windowMs: 10 * 60 * 1000,
});

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get('postId');

	if (!postId) {
		return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
	}

	try {
		const { data: comments, error } =
			await commentsService.getCommentsByPostId(postId);

		if (error) {
			return NextResponse.json({ comments: [] });
		}

		return NextResponse.json({ comments: comments || [] });
	} catch {
		return NextResponse.json({ comments: [] });
	}
}

export async function POST(request: NextRequest) {
	if (checkRateLimit(request)) {
		return NextResponse.json(
			{ error: 'Too many requests. Please try again later.' },
			{ status: 429 }
		);
	}

	try {
		const body = await request.json();
		const {
			postId,
			authorName,
			authorEmail,
			content,
			parentId,
			recaptchaToken,
		} = body;

		if (!postId || !authorName || !authorEmail || !content) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		if (!recaptchaToken) {
			return NextResponse.json(
				{ error: 'reCAPTCHA verification failed' },
				{ status: 400 }
			);
		}

		const recaptcha = await verifyRecaptcha(recaptchaToken);
		if (!recaptcha.valid) {
			return NextResponse.json(
				{ error: 'reCAPTCHA verification failed' },
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

		const isApproved = recaptcha.score >= 0.8;

		const { data: newComment, error } = await commentsService.createComment({
			postId,
			authorName,
			authorEmail,
			content,
			parentId,
			isApproved,
		});

		if (error || !newComment) {
			console.error('Error creating comment:', error);
			return NextResponse.json(
				{ error: 'Failed to create comment' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ comment: newComment, pending: !isApproved },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating comment:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
