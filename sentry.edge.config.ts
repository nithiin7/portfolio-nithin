import * as Sentry from '@sentry/nextjs';

Sentry.init({
	dsn: 'https://4b6767817c03052309961462edc0e93e@o4509770183737344.ingest.de.sentry.io/4509770185244752',
	enabled: process.env.NODE_ENV === 'production',
	tracesSampleRate: 1,
	enableLogs: true,
	debug: false,
});
