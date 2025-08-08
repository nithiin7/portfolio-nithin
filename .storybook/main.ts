import path from 'path';

import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-onboarding',
		'storybook-addon-sass-postcss',
	],
	framework: {
		name: '@storybook/nextjs',
		options: {
			nextConfigPath: '../next.config.js',
		},
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) =>
				prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
		},
	},
	docs: {
		defaultName: 'Documentation',
	},

	webpackFinal: async (config) => {
		if (config.resolve) {
			config.resolve.alias = {
				...config.resolve.alias,
				styles: path.resolve(__dirname, '../src/styles'),
			};
		}

		const rules = config.module?.rules || [];

		rules.forEach((rule) => {
			if (rule && typeof rule === 'object' && 'test' in rule) {
				const { test } = rule;

				if (
					test &&
					(test.toString().includes('scss') || test.toString().includes('sass'))
				) {
					const ruleUse = rule.use;

					if (Array.isArray(ruleUse)) {
						ruleUse.forEach((use) => {
							if (
								use &&
								typeof use === 'object' &&
								'loader' in use &&
								use.loader &&
								typeof use.loader === 'string' &&
								use.loader.includes('sass-loader')
							) {
								const currentOptions = use.options || {};
								use.options = {
									...(typeof currentOptions === 'object' ? currentOptions : {}),
									sassOptions: {
										...(typeof currentOptions === 'object' &&
										currentOptions &&
										'sassOptions' in currentOptions &&
										typeof currentOptions.sassOptions === 'object'
											? currentOptions.sassOptions
											: {}),
										includePaths: [
											path.resolve(__dirname, '../src'),
											path.resolve(__dirname, '../src/styles'),
										],
									},
								};
							}
						});
					}
				}
			}
		});
		return config;
	},
};

export default config;
