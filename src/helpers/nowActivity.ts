import type { NowActivityItem } from 'types/activity';
import type { DevToStats } from 'types/devto';
import type { GithubStats } from 'types/github';
import type { WakaTimeStats } from 'types/wakatime';

/**
 * Combines the most recent signal from each already-fetched stats source
 * into a single "what I'm doing this week" feed, newest first.
 */
export const buildNowActivity = (
	wakatime: WakaTimeStats | null,
	github: GithubStats | null,
	devto: DevToStats | null
): NowActivityItem[] => {
	const items: NowActivityItem[] = [];

	const latestCodingDay = [...(wakatime?.days ?? [])]
		.reverse()
		.find((day) => day.totalSeconds > 0);
	if (latestCodingDay) {
		items.push({
			id: 'wakatime',
			label: `Coded ${latestCodingDay.text}`,
			timestamp: latestCodingDay.date,
		});
	}

	const recentRepo = github?.recentRepos[0];
	if (recentRepo) {
		items.push({
			id: 'github',
			label: `Pushed to ${recentRepo.name}`,
			timestamp: recentRepo.pushedAt,
			url: recentRepo.url,
		});
	}

	if (devto?.latest) {
		items.push({
			id: 'devto',
			label: `Published "${devto.latest.title}"`,
			timestamp: devto.latest.publishedAt,
			url: devto.latest.url,
		});
	}

	return items
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		)
		.slice(0, 3);
};
