import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import { withSerwist } from '@serwist/turbopack';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,
	// Dynamic routes (/blog) otherwise stream <meta> into <body> for any UA not
	// on Next's bot list, which SEO crawlers and Lighthouse then miss
	htmlLimitedBots: /.*/,
	experimental: {
		viewTransition: true,
		optimizePackageImports: ['react-icons'],
	},
	images: {
		qualities: [75],
		// Default list plus 2560 so 1440p and 4K get a close match instead of
		// jumping straight to 3840; mobile picks are unchanged.
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.ctfassets.net',
			},
		],
	},
	webpack(config, { isServer }) {
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

		if (!isServer && config.optimization?.splitChunks) {
			config.optimization.splitChunks.cacheGroups = {
				...config.optimization.splitChunks.cacheGroups,
				contentfulRichText: {
					test: /[\\/]node_modules[\\/]@contentful[\\/]rich-text-react-renderer[\\/]/,
					name: 'contentful-rich-text',
					chunks: 'all',
					priority: 40,
					enforce: true,
				},
			};
		}

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

export default withSentryConfig(withBundleAnalyzer(withSerwist(nextConfig)), {
	org: 'personal-tn1',
	project: 'javascript-nextjs',
	silent: true,
	widenClientFileUpload: true,
	webpack: {
		treeshake: { removeDebugLogging: true },
		automaticVercelMonitors: true,
	},
});
