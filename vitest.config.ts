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
	},
});
