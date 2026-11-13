import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadDevToStats } from 'helpers/devto';
import { fetchJson } from 'helpers/http';
import { loadWakaTimeStats } from 'helpers/wakatime';

vi.mock('helpers/http', () => ({ fetchJson: vi.fn() }));

afterEach(() => {
	vi.unstubAllEnvs();
	vi.mocked(fetchJson).mockReset();
});

describe('loadDevToStats', () => {
	it('sums articles and picks the latest', async () => {
		vi.mocked(fetchJson).mockResolvedValue([
			{
				title: 'Latest',
				url: 'https://dev.to/x/latest',
				public_reactions_count: 5,
				comments_count: 2,
				published_at: '2026-02-01',
			},
			{
				title: 'Older',
				url: 'https://dev.to/x/older',
				public_reactions_count: 3,
				comments_count: 1,
				published_at: '2026-01-01',
			},
		]);

		await expect(loadDevToStats()).resolves.toMatchObject({
			totalArticles: 2,
			totalReactions: 8,
			totalComments: 3,
			latest: { title: 'Latest', reactionsCount: 5 },
		});
	});

	it('is null when dev.to fails or has no articles', async () => {
		vi.mocked(fetchJson).mockResolvedValueOnce(null).mockResolvedValueOnce([]);

		await expect(loadDevToStats()).resolves.toBeNull();
		await expect(loadDevToStats()).resolves.toBeNull();
	});
});

describe('loadWakaTimeStats', () => {
	const day = (date: string, seconds: number, languages = {}) => ({
		range: { date },
		grand_total: { total_seconds: seconds },
		languages: Object.entries(languages).map(([name, total_seconds]) => ({
			name,
			total_seconds,
		})),
	});

	it('is null without an API key, without calling WakaTime', async () => {
		vi.stubEnv('WAKATIME_API_KEY', '');

		await expect(loadWakaTimeStats()).resolves.toBeNull();
		expect(fetchJson).not.toHaveBeenCalled();
	});

	it('derives totals, active-day average, best day and languages', async () => {
		vi.stubEnv('WAKATIME_API_KEY', 'key');
		vi.mocked(fetchJson).mockResolvedValue({
			data: [
				day('2026-01-01', 3600, { TypeScript: 3000, SCSS: 600 }),
				day('2026-01-02', 0),
				day('2026-01-03', 5400, { TypeScript: 5400 }),
			],
		});

		const stats = await loadWakaTimeStats();

		expect(stats).toMatchObject({
			humanReadableTotal: '2h 30m',
			humanReadableDailyAverage: '1h 15m',
			totalSeconds: 9000,
			bestDay: { date: '2026-01-03', text: '1h 30m' },
		});
		expect(stats?.languages.map((language) => language.name)).toEqual([
			'TypeScript',
			'SCSS',
		]);
		expect(stats?.languages[0]?.percent).toBeCloseTo(93.33, 1);
	});
});
