import { afterEach, describe, expect, it, vi } from 'vitest';

import { assertEnv, missingEnv, serverEnv } from 'helpers/env';

const complete = {
	CONTENTFUL_SPACE_ID: 's',
	CONTENTFUL_ENVIRONMENT: 'master',
	CONTENTFUL_VERSION: 'v1',
	CONTENTFUL_ACCESS_TOKEN: 't',
	NEXT_PUBLIC_SUPABASE_URL: 'u',
	NEXT_PUBLIC_SUPABASE_ANON_KEY: 'k',
	NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'r',
	NEXT_PUBLIC_SERVICE_ID: 's',
	NEXT_PUBLIC_TEMPLATE_ID: 't',
	NEXT_PUBLIC_EMAILJS_ID: 'e',
};

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
});

describe('missingEnv', () => {
	it('reports nothing for a complete environment', () => {
		expect(missingEnv(complete)).toEqual({ content: [], features: [] });
	});

	it('splits missing content and feature variables', () => {
		const { CONTENTFUL_ACCESS_TOKEN, NEXT_PUBLIC_EMAILJS_ID, ...rest } =
			complete;
		void CONTENTFUL_ACCESS_TOKEN;
		void NEXT_PUBLIC_EMAILJS_ID;

		expect(missingEnv(rest)).toEqual({
			content: ['CONTENTFUL_ACCESS_TOKEN'],
			features: ['NEXT_PUBLIC_EMAILJS_ID'],
		});
	});

	it('requires the preview token only in preview mode', () => {
		expect(
			missingEnv({ ...complete, CONTENTFUL_PREVIEW: 'true' }).content
		).toEqual(['CONTENTFUL_PREVIEW_ACCESS_TOKEN']);
	});

	it('treats empty strings as missing', () => {
		expect(
			missingEnv({ ...complete, CONTENTFUL_SPACE_ID: '' }).content
		).toEqual(['CONTENTFUL_SPACE_ID']);
	});
});

describe('assertEnv', () => {
	it('throws one error naming every missing content variable', () => {
		expect(() => assertEnv({})).toThrow(
			'Missing required environment variables: CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT, CONTENTFUL_VERSION, CONTENTFUL_ACCESS_TOKEN.'
		);
	});

	it('only logs missing feature variables', () => {
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { NEXT_PUBLIC_SERVICE_ID, ...rest } = complete;
		void NEXT_PUBLIC_SERVICE_ID;

		expect(() => assertEnv(rest)).not.toThrow();
		expect(log).toHaveBeenCalledWith(
			expect.stringContaining('NEXT_PUBLIC_SERVICE_ID')
		);
	});
});

describe('serverEnv', () => {
	it('throws when a required variable is read while unset', () => {
		vi.stubEnv('CONTENTFUL_SPACE_ID', '');

		expect(() => serverEnv.CONTENTFUL_SPACE_ID).toThrow(
			'Missing required environment variable: CONTENTFUL_SPACE_ID'
		);
	});

	it('returns undefined for unset optional variables', () => {
		vi.stubEnv('OPENAI_API_KEY', '');

		expect(serverEnv.OPENAI_API_KEY).toBeUndefined();
	});
});
