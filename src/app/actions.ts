'use server';

import { headers } from 'next/headers';

import { createRateLimiter } from 'helpers/apiProtection';
import { emailSchema } from 'helpers/validations';
import { newsletterSubscriptionsService } from 'services/subscriptions';

interface SubscribeActionResult {
	success: boolean;
	error?: string;
}

const isRateLimited = createRateLimiter({
	max: 5,
	windowMs: 10 * 60 * 1000,
});

/** Server action that subscribes an email to the newsletter. */
export async function subscribeToNewsletter(
	email: string
): Promise<SubscribeActionResult> {
	if (isRateLimited(await headers())) {
		return {
			success: false,
			error: 'Too many requests. Please try again later.',
		};
	}

	if (!(await emailSchema.isValid({ email }))) {
		return { success: false, error: 'Invalid email format' };
	}

	const { error } = await newsletterSubscriptionsService.subscribeEmail({
		email,
	});

	if (error) {
		console.error('Error subscribing email:', error);

		// Race-condition fallback: subscribeEmail checks-then-inserts, so a
		// concurrent signup can still hit the table's unique constraint.
		if (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			error.code === '23505'
		) {
			return { success: false, error: 'This email is already subscribed' };
		}

		return { success: false, error: 'Failed to subscribe email' };
	}

	return { success: true };
}
