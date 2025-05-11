// eslint.config.mjs - ESLint configuration for Next.js 15 with TypeScript and Prettier

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import a11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	{
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	{
		// Next.js specific rules
		plugins: {
			'@next/next': nextPlugin,
		},
		rules: {
			'@next/next/no-html-link-for-pages': 'error',
			'@next/next/no-img-element': 'warn',
			'@next/next/no-unwanted-polyfillio': 'warn',
			'@next/next/no-page-custom-font': 'warn',
		},
	},
	{
		// React rules
		plugins: {
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
		},
		rules: {
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
			'react/prop-types': 'off', // Since we use TypeScript
			'react/react-in-jsx-scope': 'off', // Not needed in Next.js
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		// Import rules
		plugins: {
			import: importPlugin,
		},
		rules: {
			'import/no-unresolved': 'error',
			'import/named': 'error',
			'import/default': 'error',
			'import/export': 'error',
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						['parent', 'sibling'],
						'index',
					],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
		},
		settings: {
			'import/resolver': {
				typescript: true,
				node: true,
			},
		},
	},
	{
		// Accessibility rules
		plugins: {
			'jsx-a11y': a11yPlugin,
		},
		rules: {
			'jsx-a11y/alt-text': 'warn',
			'jsx-a11y/anchor-has-content': 'warn',
			'jsx-a11y/anchor-is-valid': 'warn',
			'jsx-a11y/aria-props': 'warn',
			'jsx-a11y/aria-proptypes': 'warn',
			'jsx-a11y/aria-role': 'warn',
			'jsx-a11y/role-has-required-aria-props': 'warn',
			'jsx-a11y/img-redundant-alt': 'warn',
			'jsx-a11y/no-static-element-interactions': 'warn',
			'jsx-a11y/no-noninteractive-element-interactions': 'warn',
			'jsx-a11y/click-events-have-key-events': 'warn',
		},
	},
	{
		// Prettier integration
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					trailingComma: 'es5',
					tabWidth: 2,
					semi: true,
					printWidth: 100,
					arrowParens: 'avoid',
					endOfLine: 'auto',
				},
			],
		},
	},
	{
		// TypeScript-specific rules
		rules: {
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: false,
				},
			],
			'no-console': 'warn',
		},
	},
	{
		// Files configurations
		files: [
			'**/*.ts',
			'**/*.tsx',
			'**/*.js',
			'**/*.jsx',
			'**/*.mjs',
			'**/*.cjs',
		],
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'dist/**',
			'build/**',
			'*.config.js',
			'*.config.mjs',
		],
	},
];
