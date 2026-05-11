import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { commentsService } from 'services/comments';

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
			console.error('Error fetching comments:', error);
			return NextResponse.json(
				{ error: 'Failed to fetch comments' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ comments: comments || [] });
	} catch (error) {
		console.error('Error in GET /api/comments:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

async function verifyRecaptcha(token: string): Promise<boolean> {
	const secret = process.env.RECAPTCHA_SECRET_KEY;
	if (!secret) return false;

	const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
	});

	const json = (await res.json()) as { success: boolean; score?: number };
	return json.success && (json.score ?? 1) >= 0.5;
}

export async function POST(request: NextRequest) {
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

		if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken))) {
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

		const { data: newComment, error } = await commentsService.createComment({
			postId,
			authorName,
			authorEmail,
			content,
			parentId,
		});

		if (error || !newComment) {
			console.error('Error creating comment:', error);
			return NextResponse.json(
				{ error: 'Failed to create comment' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ comment: newComment }, { status: 201 });
	} catch (error) {
		console.error('Error creating comment:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
