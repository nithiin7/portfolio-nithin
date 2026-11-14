import { timingSafeEqual } from 'node:crypto';

import { NextResponse } from 'next/server';
import { ValidationError, type AnyObjectSchema, type InferType } from 'yup';

import { serverEnv } from 'helpers/env';

interface RateLimiterOptions {
	max: number;
	windowMs: number;
}

type HeaderReader = Pick<Headers, 'get'>;

export const clientIp = (headers: HeaderReader): string =>
	headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
	headers.get('x-real-ip') ||
	'unknown';

export const createRateLimiter = ({ max, windowMs }: RateLimiterOptions) => {
	const hits = new Map<string, { count: number; resetAt: number }>();

	return (headers: HeaderReader): boolean => {
		const ip = clientIp(headers);
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
};

export const verifyRecaptcha = async (
	token: string
): Promise<{ valid: boolean; score: number }> => {
	const secret = serverEnv.RECAPTCHA_SECRET_KEY;
	if (!secret) return { valid: false, score: 0 };

	const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
	});

	const json: unknown = await res.json();
	const success =
		typeof json === 'object' && json !== null && 'success' in json
			? json.success === true
			: false;
	const score =
		typeof json === 'object' &&
		json !== null &&
		'score' in json &&
		typeof json.score === 'number'
			? json.score
			: 0;
	return { valid: success && score >= 0.5, score };
};

export const isRecaptchaConfigured = (): boolean =>
	Boolean(serverEnv.RECAPTCHA_SECRET_KEY);

export const secretsMatch = (
	received: string | null,
	expected: string | undefined
): boolean => {
	if (!received || !expected) return false;
	const a = Buffer.from(received);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
};

export const jsonError = (
	status: number,
	error: string
): NextResponse<{ error: string }> => NextResponse.json({ error }, { status });

export const tooManyRequests = (
	message = 'Too many requests. Please try again later.'
): NextResponse<{ error: string }> => jsonError(429, message);

export const parseJsonBody = async <S extends AnyObjectSchema>(
	request: Request,
	schema: S
): Promise<
	| { data: InferType<S>; response?: never }
	| { data?: never; response: NextResponse<{ error: string }> }
> => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return { response: jsonError(400, 'Invalid JSON body') };
	}

	try {
		return {
			data: await schema.validate(body, { stripUnknown: true }),
		};
	} catch (error) {
		if (error instanceof ValidationError) {
			return { response: jsonError(400, error.message) };
		}
		throw error;
	}
};
