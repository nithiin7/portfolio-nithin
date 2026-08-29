import { describe, expect, it } from 'vitest';

import { buildNowActivity } from 'helpers/nowActivity';
import type { DevToStats } from 'types/devto';
import type { GithubStats } from 'types/github';
import type { WakaTimeStats } from 'types/wakatime';

const wakatime: WakaTimeStats = {
	humanReadableTotal: '10 hrs',
	humanReadableDailyAverage: '1.5 hrs',
	totalSeconds: 36000,
	bestDay: null,
	languages: [],
	days: [
		{ date: '2026-08-24', totalSeconds: 0, text: '0 secs' },
		{ date: '2026-08-25', totalSeconds: 7200, text: '2 hrs' },
		{ date: '2026-08-26', totalSeconds: 0, text: '0 secs' },
	],
};

const github: GithubStats = {
	repoCount: 12,
	totalStars: 34,
	followers: 5,
	topLanguages: [],
	recentRepos: [
		{
			name: 'portfolio-nithin',
			url: 'https://github.com/nithiin7/portfolio-nithin',
			language: 'TypeScript',
			pushedAt: '2026-08-27T10:00:00Z',
			stars: 3,
		},
	],
};

const devto: DevToStats = {
	totalArticles: 4,
	totalReactions: 20,
	totalComments: 2,
	latest: {
		title: 'Building a live stats page',
		url: 'https://dev.to/nithiin7/building-a-live-stats-page',
		reactionsCount: 10,
		commentsCount: 1,
		publishedAt: '2026-08-20T10:00:00Z',
	},
};

describe('buildNowActivity', () => {
	it('sorts items newest first across sources', () => {
		const result = buildNowActivity(wakatime, github, devto);

		expect(result.map((item) => item.id)).toEqual([
			'github',
			'wakatime',
			'devto',
		]);
	});

	it('skips the wakatime entry when no day has logged time', () => {
		const zeroedWakatime: WakaTimeStats = {
			...wakatime,
			days: wakatime.days.map((day) => ({
				...day,
				totalSeconds: 0,
			})),
		};

		const result = buildNowActivity(zeroedWakatime, null, null);

		expect(result).toEqual([]);
	});

	it('returns an empty list when every source is null', () => {
		expect(buildNowActivity(null, null, null)).toEqual([]);
	});

	it('caps the feed at three items', () => {
		const manyRepos: GithubStats = {
			...github,
			recentRepos: github.recentRepos,
		};

		const result = buildNowActivity(wakatime, manyRepos, devto);

		expect(result.length).toBeLessThanOrEqual(3);
	});
});
