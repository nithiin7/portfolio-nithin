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
				gsapCore: {
					test: /[\\/]node_modules[\\/]gsap[\\/](?!(ScrollTrigger|Observer))/,
					name: 'gsap-core',
					chunks: 'all',
					priority: 40,
					enforce: true,
				},
				gsapScroll: {
					test: /[\\/]node_modules[\\/]gsap[\\/](ScrollTrigger|Observer)/,
					name: 'gsap-scroll',
					chunks: 'async',
					priority: 41,
					enforce: true,
				},
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
