import { NextRequest } from 'next/server';

let ipCounter = 0;

export const freshIp = (): string => `10.0.0.${++ipCounter}`;

export const apiRequest = (
	path: string,
	{
		method = 'GET',
		body,
		headers = {},
		ip = freshIp(),
	}: {
		method?: string;
		body?: unknown;
		headers?: Record<string, string>;
		ip?: string;
	} = {}
): NextRequest =>
	new NextRequest(`http://localhost${path}`, {
		method,
		headers: { 'x-forwarded-for': ip, ...headers },
		body:
			body === undefined
				? undefined
				: typeof body === 'string'
					? body
					: JSON.stringify(body),
	});

export const recaptchaResponse = (score: number, success = true): Response =>
	new Response(JSON.stringify({ success, score }));
