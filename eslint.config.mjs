import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import a11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	{
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: ['./tsconfig.json', './.storybook/tsconfig.json'],
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	{
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
		plugins: {
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
		},
		rules: {
			'react/jsx-uses-react': 'error',
			'react/jsx-uses-vars': 'error',
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
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
		plugins: {
			import: importPlugin,
		},
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			'import/no-unresolved': 'error',
			// TypeScript validates named imports; the import plugin cannot follow
			// motion/react's export-map re-exports and false-positives in CI.
			'import/named': 'off',
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
	},
	{
		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},
			'import/resolver': {
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
					moduleDirectory: ['node_modules', 'src/'],
				},
			},
		},
	},
	{
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
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			'prettier/prettier': [
				'error',
				{
					tabWidth: 2,
					useTabs: true,
					printWidth: 80,
					semi: true,
					trailingComma: 'es5',
					singleQuote: true,
					endOfLine: 'lf',
				},
			],
		},
	},
	{
		rules: {
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: false,
				},
			],
		},
	},
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'dist/**',
			'build/**',
			'public/**',
			'coverage/**',
			'*.config.js',
			'*.config.mjs',
			'next.config.js',
			'next.config.mjs',
			'next-env.d.ts',
			'postcss.config.js',
			'tailwind.config.js',
			'tailwind.config.ts',
		],
	},
	{
		files: ['.storybook/**/*.ts', '.storybook/**/*.tsx'],
		rules: {
			'import/no-default-export': 'off',
		},
	},
	...storybook.configs['flat/recommended'],
];
