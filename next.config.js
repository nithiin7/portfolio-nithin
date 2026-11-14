import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import { withSerwist } from '@serwist/turbopack';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

// Report-Only until it has run clean in production; violations go to Sentry.
// 'unsafe-inline' scripts: the theme/preloader bootstraps and Next's inline
// RSC payload need it until nonces (which force dynamic rendering) are worth it.
const CSP_REPORT_URI =
	'https://o4509770183737344.ingest.de.sentry.io/api/4509770185244752/security/?sentry_key=4b6767817c03052309961462edc0e93e';

// Vercel injects its toolbar (vercel.live) into preview deployments only;
// without these origins every preview logs CSP violations, which fails the
// Lighthouse best-practices budget and floods Sentry with reports.
const isPreview = process.env.VERCEL_ENV === 'preview';
const previewOrigins = (origins) => (isPreview ? ` ${origins}` : '');

const contentSecurityPolicy = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com${previewOrigins('https://vercel.live')}`,
	`style-src 'self' 'unsafe-inline'${previewOrigins('https://vercel.live')}`,
	`img-src 'self' data: blob: https://images.ctfassets.net https://www.googletagmanager.com https://*.google-analytics.com${previewOrigins('https://vercel.live https://vercel.com')}`,
	`font-src 'self' data:${previewOrigins('https://vercel.live https://assets.vercel.com')}`,
	`connect-src 'self' https://*.ingest.de.sentry.io https://*.supabase.co https://api.emailjs.com https://www.google.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${previewOrigins('https://vercel.live wss://ws-us3.pusher.com')}`,
	`frame-src https://www.google.com https://*.hf.space https://www.googletagmanager.com${previewOrigins('https://vercel.live')}`,
	"worker-src 'self'",
	"manifest-src 'self'",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	`report-uri ${CSP_REPORT_URI}`,
].join('; ');

// Sent on every response, including static assets
const transportHeaders = [
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains',
	},
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
];

// Only meaningful on documents; skipping them on /_next/static keeps ~1 KB of
// headers off every script and stylesheet request
const documentHeaders = [
	{
		key: 'Content-Security-Policy-Report-Only',
		value: contentSecurityPolicy,
	},
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
	},
];

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
	async headers() {
		return [
			{ source: '/:path*', headers: transportHeaders },
			{
				source: '/((?!_next/static|_next/image).*)',
				headers: documentHeaders,
			},
		];
	},
	// Slugs shortened in the phase 14 copy pass (docs/cms/COPY_REVIEW.md A14, A16)
	async redirects() {
		return [
			[
				'/blog/i-built-a-free-fully-local-ai-resume-builder-no-subscriptions-no-cloud-no-catch',
				'/blog/free-local-ai-resume-builder',
			],
			[
				'/blog/frontend-performance-optimization-in-2025-modern-techniques-every-developer',
				'/blog/frontend-performance-techniques',
			],
			['/portfolio/persona-ai-resume-builder', '/portfolio/persona'],
			['/portfolio/repochat-codebase-intelligence', '/portfolio/repochat'],
		].map(([source, destination]) => ({
			source,
			destination,
			permanent: true,
		}));
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

const DEFAULT_PAGE_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js'];

const SENTRY_OPTIONS = {
	org: 'personal-tn1',
	project: 'javascript-nextjs',
	silent: true,
	widenClientFileUpload: true,
	webpack: {
		treeshake: { removeDebugLogging: true },
		automaticVercelMonitors: true,
	},
};

// `page.dev.tsx` / `route.dev.ts` (e.g. /dev/plates) only exist under `next dev`,
// so production builds never compile, route or sitemap them.
export default (phase) =>
	withSentryConfig(
		withBundleAnalyzer(
			withSerwist({
				...nextConfig,
				pageExtensions:
					phase === PHASE_DEVELOPMENT_SERVER
						? [
								...DEFAULT_PAGE_EXTENSIONS.map((ext) => `dev.${ext}`),
								...DEFAULT_PAGE_EXTENSIONS,
							]
						: DEFAULT_PAGE_EXTENSIONS,
			})
		),
		SENTRY_OPTIONS
	);
