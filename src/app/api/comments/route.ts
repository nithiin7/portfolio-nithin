import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { commentsService } from 'services/comments';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(request: NextRequest): boolean {
	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
		request.headers.get('x-real-ip') ||
		'unknown';
	const now = Date.now();
	const record = rateLimitMap.get(ip);

	if (!record || now > record.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}

	if (record.count >= RATE_LIMIT_MAX) return true;
	record.count++;
	return false;
}

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

async function verifyRecaptcha(
	token: string
): Promise<{ valid: boolean; score: number }> {
	const secret = process.env.RECAPTCHA_SECRET_KEY;
	if (!secret) return { valid: false, score: 0 };

	const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
	});

	const json = (await res.json()) as { success: boolean; score?: number };
	const score = json.score ?? 0;
	return { valid: json.success && score >= 0.5, score };
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
