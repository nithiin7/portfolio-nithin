import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchJson } from 'helpers/http';

describe('fetchJson', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns parsed JSON for a 2xx response', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(new Response(JSON.stringify({ likes: 3 })))
		);

		await expect(fetchJson('https://example.com')).resolves.toEqual({
			likes: 3,
		});
	});

	it('returns null for a non-2xx response', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(new Response('nope', { status: 500 }))
		);

		await expect(fetchJson('https://example.com')).resolves.toBeNull();
	});

	it('returns null when the request throws', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

		await expect(fetchJson('https://example.com')).resolves.toBeNull();
	});

	it('returns null for a malformed JSON body', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not json')));

		await expect(fetchJson('https://example.com')).resolves.toBeNull();
	});
});
