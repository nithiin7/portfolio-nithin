import { afterEach, describe, expect, it, vi } from 'vitest';
import * as yup from 'yup';

import {
	clientIp,
	createRateLimiter,
	parseJsonBody,
	secretsMatch,
	verifyRecaptcha,
} from 'helpers/apiProtection';

const headers = (values: Record<string, string>): Headers =>
	new Headers(values);

const jsonRequest = (body: string): Request =>
	new Request('http://localhost/api', { method: 'POST', body });

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

describe('clientIp', () => {
	it('takes the first forwarded address', () => {
		expect(clientIp(headers({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' }))).toBe(
			'1.1.1.1'
		);
	});

	it('falls back to x-real-ip, then "unknown"', () => {
		expect(clientIp(headers({ 'x-real-ip': '3.3.3.3' }))).toBe('3.3.3.3');
		expect(clientIp(headers({}))).toBe('unknown');
	});
});

describe('createRateLimiter', () => {
	it('allows max requests per window per IP, then resets', () => {
		vi.useFakeTimers();
		const limited = createRateLimiter({ max: 2, windowMs: 1000 });
		const a = headers({ 'x-forwarded-for': '1.1.1.1' });
		const b = headers({ 'x-forwarded-for': '2.2.2.2' });

		expect([limited(a), limited(a), limited(a)]).toEqual([false, false, true]);
		expect(limited(b)).toBe(false);

		vi.advanceTimersByTime(1001);
		expect(limited(a)).toBe(false);
	});
});

describe('secretsMatch', () => {
	it('matches equal secrets only', () => {
		expect(secretsMatch('abc', 'abc')).toBe(true);
		expect(secretsMatch('abc', 'abd')).toBe(false);
		expect(secretsMatch('abc', 'abcd')).toBe(false);
	});

	it('never matches when either side is missing', () => {
		expect(secretsMatch(null, 'abc')).toBe(false);
		expect(secretsMatch('abc', undefined)).toBe(false);
		expect(secretsMatch('', '')).toBe(false);
	});
});

describe('verifyRecaptcha', () => {
	const google = (payload: unknown) =>
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({ json: () => Promise.resolve(payload) })
		);

	it('is invalid without a secret, without calling Google', async () => {
		vi.stubEnv('RECAPTCHA_SECRET_KEY', '');
		const fetchSpy = vi.fn();
		vi.stubGlobal('fetch', fetchSpy);

		await expect(verifyRecaptcha('t')).resolves.toEqual({
			valid: false,
			score: 0,
		});
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('needs success and a score of at least 0.5', async () => {
		vi.stubEnv('RECAPTCHA_SECRET_KEY', 'secret');

		google({ success: true, score: 0.9 });
		await expect(verifyRecaptcha('t')).resolves.toEqual({
			valid: true,
			score: 0.9,
		});

		google({ success: true, score: 0.3 });
		await expect(verifyRecaptcha('t')).resolves.toEqual({
			valid: false,
			score: 0.3,
		});

		google({ success: false });
		await expect(verifyRecaptcha('t')).resolves.toEqual({
			valid: false,
			score: 0,
		});
	});
});

describe('parseJsonBody', () => {
	const schema = yup.object({
		name: yup.string().required('Name is required'),
	});

	it('returns the validated body with unknown keys stripped', async () => {
		const result = await parseJsonBody(
			jsonRequest('{"name":"Ada","admin":true}'),
			schema
		);

		expect(result.data).toEqual({ name: 'Ada' });
	});

	it('answers 400 with the first validation message', async () => {
		const { response } = await parseJsonBody(jsonRequest('{}'), schema);

		expect(response?.status).toBe(400);
		await expect(response?.json()).resolves.toEqual({
			error: 'Name is required',
		});
	});

	it('answers 400 for malformed JSON', async () => {
		const { response } = await parseJsonBody(jsonRequest('{'), schema);

		await expect(response?.json()).resolves.toEqual({
			error: 'Invalid JSON body',
		});
	});
});
