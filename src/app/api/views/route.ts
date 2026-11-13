import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
	createRateLimiter,
	jsonError,
	parseJsonBody,
	tooManyRequests,
} from 'helpers/apiProtection';
import { SLUG_PATTERN, viewRequestSchema } from 'helpers/validations';
import { viewsService } from 'services/views';

const isRateLimited = createRateLimiter({
	max: 60,
	windowMs: 10 * 60 * 1000,
});

export async function GET(request: NextRequest) {
	const slug = request.nextUrl.searchParams.get('slug');

	if (!slug || !SLUG_PATTERN.test(slug)) {
		return jsonError(400, 'Slug is required');
	}

	try {
		const { data: viewCount, error } = await viewsService.getViewCount(slug);
		return NextResponse.json({ viewCount: error ? 0 : (viewCount ?? 0) });
	} catch {
		return NextResponse.json({ viewCount: 0 });
	}
}

export async function POST(request: NextRequest) {
	if (isRateLimited(request.headers)) return tooManyRequests();

	const { data, response } = await parseJsonBody(request, viewRequestSchema);
	if (response) return response;

	try {
		const { error } = await viewsService.incrementView(data.slug);
		if (error) return jsonError(500, 'Failed to record view');
		return NextResponse.json({ success: true });
	} catch {
		return jsonError(500, 'Failed to record view');
	}
}
