import { withSentryConfig } from '@sentry/nextjs';

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

export default withSentryConfig(nextConfig, {
	org: 'personal-tn1',
	project: 'javascript-nextjs',
	silent: true,
	widenClientFileUpload: true,
	disableLogger: true,
	automaticVercelMonitors: true,
});
