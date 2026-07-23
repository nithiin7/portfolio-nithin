'use server';

import { newsletterSubscriptionsService } from 'services/subscriptions';

interface SubscribeActionResult {
	success: boolean;
	error?: string;
}

export async function subscribeToNewsletter(
	email: string
): Promise<SubscribeActionResult> {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
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
