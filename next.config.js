/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_SPACE_ID: '3tceq0itz5kj',
		NEXT_PUBLIC_VERSION: 'v1',
		NEXT_PUBLIC_ENVIRONMENT: 'master',
		NEXT_PUBLIC_AUTHORIZATION_TOKEN:
			'EoivlAc4VSaHS3gkCNXTYB--HKkf3gSKBR8nn_NY5DA',
		NEXT_PUBLIC_SERVICE_ID: 'service_hh0l7yp',
		NEXT_PUBLIC_TEMPLATE_ID: 'template_va5jl1g',
		NEXT_PUBLIC_GOOGLE_GTM_ID: 'GTM-P4D6XZ2C',
		NEXT_PUBLIC_EMAILJS_ID: 'g4AdPHbp-OKcLJaca',
		NEXT_PUBLIC_SUPABASE_URL: 'https://olitsvyfbbkdjksmoteo.supabase.co',
		NEXT_PUBLIC_SUPABASE_ANON_KEY:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9saXRzdnlmYmJrZGprc21vdGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTMzOTUsImV4cCI6MjA2OTg4OTM5NX0.fDzKyRu0-Frb6uK4JEWhQ9q0vdxYZF5JQQFEYfgo9_A',
	},
	images: {
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

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(module.exports, {
	// For all available options, see:
	// https://www.npmjs.com/package/@sentry/webpack-plugin#options

	org: 'personal-tn1',
	project: 'javascript-nextjs',

	// Only print logs for uploading sourxce maps in CI
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
	// This can increase your server load as well as your hosting bill.
	// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
	// side errors will fail.
	// tunnelRoute: "/monitoring",

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,
});
