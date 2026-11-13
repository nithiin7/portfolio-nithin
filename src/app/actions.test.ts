// @vitest-environment node
import { headers } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { subscribeToNewsletter } from 'app/actions';
import { newsletterSubscriptionsService } from 'services/subscriptions';
import { freshIp } from 'test/api';

vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('services/subscriptions', () => ({
	newsletterSubscriptionsService: { subscribeEmail: vi.fn() },
}));

const fromIp = (ip = freshIp()) =>
	vi
		.mocked(headers)
		.mockResolvedValue(
			new Headers({ 'x-forwarded-for': ip }) as unknown as Awaited<
				ReturnType<typeof headers>
			>
		);

beforeEach(() => {
	vi.clearAllMocks();
	vi.spyOn(console, 'error').mockImplementation(() => {});
	vi.mocked(newsletterSubscriptionsService.subscribeEmail).mockResolvedValue({
		data: null,
		error: null,
	});
	fromIp();
});

describe('subscribeToNewsletter', () => {
	it('subscribes a valid email', async () => {
		await expect(subscribeToNewsletter('ada@example.com')).resolves.toEqual({
			success: true,
		});
		expect(newsletterSubscriptionsService.subscribeEmail).toHaveBeenCalledWith({
			email: 'ada@example.com',
		});
	});

	it('rejects an invalid email without touching the table', async () => {
		await expect(subscribeToNewsletter('nope')).resolves.toEqual({
			success: false,
			error: 'Invalid email format',
		});
		expect(
			newsletterSubscriptionsService.subscribeEmail
		).not.toHaveBeenCalled();
	});

	it('explains a duplicate signup', async () => {
		vi.mocked(newsletterSubscriptionsService.subscribeEmail).mockResolvedValue({
			data: null,
			error: { code: '23505' },
		});

		await expect(subscribeToNewsletter('ada@example.com')).resolves.toEqual({
			success: false,
			error: 'This email is already subscribed',
		});
	});

	it('reports other failures generically', async () => {
		vi.mocked(newsletterSubscriptionsService.subscribeEmail).mockResolvedValue({
			data: null,
			error: new Error('db'),
		});

		await expect(subscribeToNewsletter('ada@example.com')).resolves.toEqual({
			success: false,
			error: 'Failed to subscribe email',
		});
	});

	it('rate-limits after 5 attempts per IP', async () => {
		fromIp(freshIp());
		for (let i = 0; i < 5; i++) await subscribeToNewsletter('ada@example.com');

		await expect(subscribeToNewsletter('ada@example.com')).resolves.toEqual({
			success: false,
			error: 'Too many requests. Please try again later.',
		});
	});
});
