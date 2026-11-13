import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const src = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
	plugins: [
		{
			// next.config turns *.svg into React components via SVGR; mirror that
			// with a bare <svg> so components importing logos can render in jsdom.
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
