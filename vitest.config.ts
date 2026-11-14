import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const src = fileURLToPath(new URL('./src', import.meta.url));
const data = fileURLToPath(new URL('./data', import.meta.url));

export default defineConfig({
	plugins: [
		{
			name: 'svg-component-stub',
			enforce: 'pre',
			load(id) {
				if (!id.endsWith('.svg')) return null;
				return "import { createElement } from 'react'; export default (props) => createElement('svg', props);";
			},
		},
	],
	resolve: {
		alias: [
			{
				find: /^(app|assets|clients|components|config|constants|contexts|helpers|hooks|queries|services|styles|test|types)(\/.*)?$/,
				replacement: `${src}/$1$2`,
			},
			{ find: /^data\/(.*)$/, replacement: `${data}/$1` },
		],
	},
	test: {
		environment: 'jsdom',
		include: [
			'src/**/*.test.ts',
			'src/**/*.test.tsx',
			'contentful/**/*.test.ts',
		],
		setupFiles: ['./vitest.setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text-summary', 'json-summary', 'html'],
			include: [
				'src/helpers/**',
				'src/services/**',
				'src/app/api/**',
				'src/app/actions.ts',
				'src/components/utilities/**',
				'src/hooks/**',
			],
			exclude: [
				'**/*.test.{ts,tsx}',
				'src/helpers/og.tsx',
				'src/helpers/monitoring.ts',
			],
			thresholds: {
				statements: 75,
				branches: 70,
				functions: 75,
				lines: 75,
			},
		},
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
