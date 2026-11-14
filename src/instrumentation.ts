import * as Sentry from '@sentry/nextjs';

/** Checks env and loads the Sentry config for the current runtime. */
export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		const { assertEnv } = await import('helpers/env');
		assertEnv();
		await import('../sentry.server.config');
	}

	if (process.env.NEXT_RUNTIME === 'edge') {
		await import('../sentry.edge.config');
	}
}

export const onRequestError = Sentry.captureRequestError;
