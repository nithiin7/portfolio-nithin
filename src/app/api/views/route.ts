import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createRateLimiter } from 'helpers/apiProtection';
import { viewsService } from 'services/views';

const checkRateLimit = createRateLimiter({
	max: 60,
	windowMs: 10 * 60 * 1000,
});

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const slug = searchParams.get('slug');

	if (!slug) {
		return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
	}

	try {
		const { data: viewCount, error } = await viewsService.getViewCount(slug);

		if (error) {
			return NextResponse.json({ viewCount: 0 });
		}

		return NextResponse.json({ viewCount: viewCount ?? 0 });
	} catch {
		return NextResponse.json({ viewCount: 0 });
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
		const { slug } = await request.json();

		if (!slug || typeof slug !== 'string') {
			return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
		}

		const { error } = await viewsService.incrementView(slug);

		if (error) {
			return NextResponse.json(
				{ error: 'Failed to record view' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}
}
