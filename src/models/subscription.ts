import type { NewsletterSubscription } from 'types/subscription';

interface SubscribeResponse {
	message: string;
	subscription: NewsletterSubscription;
}

interface SubscriptionStatusResponse {
	subscription: NewsletterSubscription | null;
	isSubscribed: boolean;
}

/**
 * Subscribe an email to the newsletter
 */
export async function subscribeToNewsletter(
	email: string
): Promise<SubscribeResponse> {
	const response = await fetch('/api/subscribe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email }),
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.error || 'Failed to subscribe');
	}

	return result;
}

/**
 * Check if an email is already subscribed
 */
export async function checkSubscriptionStatus(
	email: string
): Promise<SubscriptionStatusResponse> {
	const response = await fetch(
		`/api/subscribe?email=${encodeURIComponent(email)}`,
		{
			method: 'GET',
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.error || 'Failed to check subscription status');
	}

	return result;
}

/**
 * Unsubscribe an email from the newsletter
 */
export async function unsubscribeFromNewsletter(
	email: string
): Promise<SubscribeResponse> {
	const response = await fetch(
		`/api/subscribe?email=${encodeURIComponent(email)}`,
		{
			method: 'DELETE',
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.error || 'Failed to unsubscribe');
	}

	return result;
}
