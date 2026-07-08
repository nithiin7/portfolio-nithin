import type { NextRequest } from 'next/server';

interface RateLimiterOptions {
	max: number;
	windowMs: number;
}

// In-memory, so limits are per serverless instance — a best-effort layer,
// not a hard guarantee. reCAPTCHA is the primary abuse check.
export function createRateLimiter({ max, windowMs }: RateLimiterOptions) {
	const hits = new Map<string, { count: number; resetAt: number }>();

	return function isRateLimited(request: NextRequest): boolean {
		const ip =
			request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
			request.headers.get('x-real-ip') ||
			'unknown';
		const now = Date.now();
		const record = hits.get(ip);

		if (!record || now > record.resetAt) {
			hits.set(ip, { count: 1, resetAt: now + windowMs });
			return false;
		}

		if (record.count >= max) return true;
		record.count++;
		return false;
	};
}

export async function verifyRecaptcha(
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

export function isRecaptchaConfigured(): boolean {
	return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}
