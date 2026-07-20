import * as Sentry from '@sentry/nextjs';

Sentry.init({
	dsn: 'https://4b6767817c03052309961462edc0e93e@o4509770183737344.ingest.de.sentry.io/4509770185244752',
	enabled: process.env.NODE_ENV === 'production',
	tracesSampleRate: 0.1,
	enableLogs: false,
	debug: false,
	ignoreErrors: [
		'ResizeObserver loop limit exceeded',
		'ResizeObserver loop completed with undelivered notifications',
		'Non-Error promise rejection captured',
		'Network request failed',
		'Failed to fetch',
		'NetworkError when attempting to fetch resource',
		'Load failed',
		/^chrome-extension:\/\//,
		/^moz-extension:\/\//,
	],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
