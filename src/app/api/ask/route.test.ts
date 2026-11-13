// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from 'app/api/ask/route';
import { createChatCompletion, createEmbeddings } from 'clients/openai';
import { apiRequest, freshIp, recaptchaResponse } from 'test/api';

vi.mock('clients/openai', () => ({
	createChatCompletion: vi.fn(),
	createEmbeddings: vi.fn(),
}));
vi.mock('data/embeddings.json', () => ({ default: { chunks: [] } }));

const ask = (body: unknown, ip?: string) =>
	POST(apiRequest('/api/ask', { method: 'POST', body, ip }));

beforeEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	vi.mocked(createChatCompletion).mockReset();
	vi.stubEnv('OPENAI_API_KEY', 'sk-test');
	vi.stubEnv('RECAPTCHA_SECRET_KEY', '');
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/ask', () => {
	it('answers 503 when the AI isn’t configured', async () => {
		vi.stubEnv('OPENAI_API_KEY', '');

		const res = await ask({ question: 'Hi?' });

		expect(res.status).toBe(503);
	});

	it('validates the question', async () => {
		expect((await ask({ question: '   ' })).status).toBe(400);
		const long = await ask({ question: 'x'.repeat(501) });
		expect(long.status).toBe(400);
		await expect(long.json()).resolves.toEqual({
			error: 'Question is too long (max 500 characters)',
		});
	});

	it('returns the model’s answer', async () => {
		vi.mocked(createChatCompletion).mockResolvedValue('Nithin works at EY.');

		const res = await ask({ question: 'Where does Nithin work?' });

		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({
			answer: 'Nithin works at EY.',
		});
		expect(createEmbeddings).not.toHaveBeenCalled();
		expect(vi.mocked(createChatCompletion).mock.calls[0]?.[0]).toEqual([
			expect.objectContaining({ role: 'system' }),
			{ role: 'user', content: 'Where does Nithin work?' },
		]);
	});

	it('maps upstream failures and empty answers to 502', async () => {
		vi.mocked(createChatCompletion).mockRejectedValueOnce(new Error('boom'));
		expect((await ask({ question: 'Hi?' })).status).toBe(502);

		vi.mocked(createChatCompletion).mockResolvedValueOnce('');
		expect((await ask({ question: 'Hi?' })).status).toBe(502);
	});

	it('rejects a failed reCAPTCHA when it is configured', async () => {
		vi.stubEnv('RECAPTCHA_SECRET_KEY', 'secret');
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(recaptchaResponse(0.1)));

		const res = await ask({ question: 'Hi?', recaptchaToken: 't' });

		expect(res.status).toBe(400);
		expect(createChatCompletion).not.toHaveBeenCalled();
	});

	it('rate-limits after 10 questions per IP', async () => {
		vi.mocked(createChatCompletion).mockResolvedValue('ok');
		const ip = freshIp();

		for (let i = 0; i < 10; i++) {
			expect((await ask({ question: 'Hi?' }, ip)).status).toBe(200);
		}
		expect((await ask({ question: 'Hi?' }, ip)).status).toBe(429);
	});

	it('answers 400 with the shared shape for a malformed body', async () => {
		const res = await ask('{');

		expect(res.status).toBe(400);
		await expect(res.json()).resolves.toEqual({
			error: 'Invalid JSON body',
		});
	});
});
