import { beforeEach, describe, expect, it, vi } from 'vitest';

import { baseService } from 'services/index';
import { newsletterSubscriptionsService } from 'services/subscriptions';

vi.mock('services/index', () => ({
	baseService: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

const row = (overrides = {}) => ({
	id: 's1',
	email: 'ada@example.com',
	is_active: true,
	subscribed_at: '2026-01-01',
	updated_at: '2026-01-01',
	...overrides,
});

beforeEach(() => {
	vi.clearAllMocks();
});

describe('subscribeEmail', () => {
	it('inserts a new subscription without RETURNING', async () => {
		vi.mocked(baseService.get).mockResolvedValue({ data: [], error: null });
		vi.mocked(baseService.post).mockResolvedValue({ data: null, error: null });

		const result = await newsletterSubscriptionsService.subscribeEmail({
			email: 'ada@example.com',
		});

		expect(baseService.post).toHaveBeenCalledWith(
			'newsletter_subscriptions',
			{ id: expect.any(String), email: 'ada@example.com' },
			{ select: false }
		);
		expect(result.data).toMatchObject({
			email: 'ada@example.com',
			isActive: true,
		});
	});

	it('returns an active subscription as-is', async () => {
		vi.mocked(baseService.get).mockResolvedValue({
			data: [row()],
			error: null,
		});

		const result = await newsletterSubscriptionsService.subscribeEmail({
			email: 'ada@example.com',
		});

		expect(result.data).toMatchObject({ id: 's1', isActive: true });
		expect(baseService.post).not.toHaveBeenCalled();
	});

	it('reactivates an inactive subscription', async () => {
		vi.mocked(baseService.get).mockResolvedValue({
			data: [row({ is_active: false })],
			error: null,
		});
		vi.mocked(baseService.patch).mockResolvedValue({
			data: row(),
			error: null,
		});

		const result = await newsletterSubscriptionsService.subscribeEmail({
			email: 'ada@example.com',
		});

		expect(baseService.patch).toHaveBeenCalledWith(
			'newsletter_subscriptions',
			's1',
			{ is_active: true }
		);
		expect(result.data?.isActive).toBe(true);
	});

	it('passes insert errors through (e.g. the unique constraint)', async () => {
		const error = { code: '23505' };
		vi.mocked(baseService.get).mockResolvedValue({ data: [], error: null });
		vi.mocked(baseService.post).mockResolvedValue({ data: null, error });

		await expect(
			newsletterSubscriptionsService.subscribeEmail({ email: 'a@b.co' })
		).resolves.toEqual({ data: null, error });
	});
});
