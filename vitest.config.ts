import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const src = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^(assets|clients|components|constants|contexts|helpers|hooks|models|queries|services|styles|types)(\/.*)?$/,
				replacement: `${src}/$1$2`,
			},
		],
	},
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
		env: {
			CONTENTFUL_SPACE_ID: 'test-space',
			CONTENTFUL_ENVIRONMENT: 'test-env',
			CONTENTFUL_VERSION: 'v1',
			CONTENTFUL_ACCESS_TOKEN: 'test-token',
			NEXT_PUBLIC_SUPABASE_URL: 'http://supabase.test',
			NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
			NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'test-site-key',
			NEXT_PUBLIC_SERVICE_ID: 'test-service-id',
			NEXT_PUBLIC_TEMPLATE_ID: 'test-template-id',
			NEXT_PUBLIC_EMAILJS_ID: 'test-emailjs-id',
		},
	},
});
