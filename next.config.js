import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		viewTransition: true,
		optimizePackageImports: ['react-icons'],
	},
	images: {
		qualities: [75],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.ctfassets.net',
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						svgo: true,
						svgoConfig: {
							plugins: [
								{
									name: 'removeViewBox',
									active: false,
								},
								{
									name: 'removeDimensions',
									active: false,
								},
							],
						},
					},
				},
			],
		});
		return config;
	},
	turbopack: {
		rules: {
			'*.svg': {
				loaders: [
					{
						loader: '@svgr/webpack',
						options: {
							svgo: true,
							svgoConfig: {
								plugins: [
									{ name: 'removeViewBox', active: false },
									{ name: 'removeDimensions', active: false },
								],
							},
						},
					},
				],
				as: '*.js',
			},
		},
	},
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
	org: 'personal-tn1',
	project: 'javascript-nextjs',
	silent: true,
	widenClientFileUpload: true,
	webpack: {
		treeshake: { removeDebugLogging: true },
		automaticVercelMonitors: true,
	},
});
