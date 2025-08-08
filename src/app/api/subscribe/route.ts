import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { newsletterSubscriptionsService } from 'services/subscriptions';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email } = body;

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email format' },
				{ status: 400 }
			);
		}

		const { data: subscription, error } =
			await newsletterSubscriptionsService.subscribeEmail({
				email,
			});

		if (error) {
			console.error('Error subscribing email:', error);

			if (
				typeof error === 'object' &&
				error !== null &&
				'code' in error &&
				error.code === '23505'
			) {
				return NextResponse.json(
					{ error: 'This email is already subscribed' },
					{ status: 409 }
				);
			}

			return NextResponse.json(
				{ error: 'Failed to subscribe email' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				message: 'Successfully subscribed to newsletter',
				subscription,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error in POST /api/subscribe:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get('email');

	if (!email) {
		return NextResponse.json(
			{ error: 'Email parameter is required' },
			{ status: 400 }
		);
	}

	try {
		const { data: subscription, error } =
			await newsletterSubscriptionsService.getSubscriptionByEmail(email);

		if (error) {
			console.error('Error fetching subscription:', error);
			return NextResponse.json(
				{ error: 'Failed to fetch subscription' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			subscription,
			isSubscribed: !!subscription && subscription.isActive,
		});
	} catch (error) {
		console.error('Error in GET /api/subscribe:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get('email');

	if (!email) {
		return NextResponse.json(
			{ error: 'Email parameter is required' },
			{ status: 400 }
		);
	}

	try {
		const { data: subscription, error } =
			await newsletterSubscriptionsService.unsubscribeEmail(email);

		if (error) {
			console.error('Error unsubscribing email:', error);
			return NextResponse.json(
				{ error: 'Failed to unsubscribe email' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Successfully unsubscribed from newsletter',
			subscription,
		});
	} catch (error) {
		console.error('Error in DELETE /api/subscribe:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
