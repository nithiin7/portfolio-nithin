import type { Preview } from '@storybook/nextjs';

import '../src/styles/tokens.scss';

const preview: Preview = {
	parameters: {
		backgrounds: {
			default: 'ink',
			values: [{ name: 'ink', value: 'var(--bg)' }],
		},
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
