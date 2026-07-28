import { fetchJson } from 'helpers/http';
import type { WakaTimeStats } from 'types/wakatime';

interface WakaTimeSummaryDay {
	range: { date: string };
	grand_total: { total_seconds: number };
	languages?: { name: string; total_seconds: number }[];
}

interface WakaTimeSummariesResponse {
	data: WakaTimeSummaryDay[];
}

const TOP_LANGUAGE_COUNT = 5;

const humanize = (seconds: number): string => {
	const totalMinutes = Math.round(seconds / 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours === 0 && minutes === 0) return '0 min';
	if (hours === 0) return `${minutes}m`;
	return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

/**
 * Derived entirely from the summaries endpoint — stats/last_7_days
 * intermittently reports zeroed aggregates while summaries stays accurate.
 */
export const loadWakaTimeStats = async (): Promise<WakaTimeStats | null> => {
	const apiKey = process.env.WAKATIME_API_KEY;
	if (!apiKey) return null;

	const summaries = await fetchJson<WakaTimeSummariesResponse>(
		'https://wakatime.com/api/v1/users/current/summaries?range=last_7_days',
		{
			headers: {
				Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
			},
			next: { revalidate: 3600 },
		}
	);

	const data = summaries?.data;
	if (!data?.length) return null;

	const days = data.map((day) => ({
		date: day.range.date,
		totalSeconds: day.grand_total.total_seconds,
		text: humanize(day.grand_total.total_seconds),
	}));

	const totalSeconds = days.reduce((sum, day) => sum + day.totalSeconds, 0);
	const activeDays = days.filter((day) => day.totalSeconds > 0).length;

	const languageSeconds = data.reduce<Record<string, number>>((acc, day) => {
		for (const language of day.languages ?? []) {
			acc[language.name] = (acc[language.name] ?? 0) + language.total_seconds;
		}
		return acc;
	}, {});

	const languages = Object.entries(languageSeconds)
		.sort(([, a], [, b]) => b - a)
		.slice(0, TOP_LANGUAGE_COUNT)
		.map(([name, seconds]) => ({
			name,
			percent: totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0,
			text: humanize(seconds),
		}));

	const bestDay = days.reduce((best, day) =>
		day.totalSeconds > best.totalSeconds ? day : best
	);

	return {
		humanReadableTotal: humanize(totalSeconds),
		humanReadableDailyAverage: humanize(
			activeDays > 0 ? totalSeconds / activeDays : 0
		),
		totalSeconds,
		bestDay:
			bestDay.totalSeconds > 0
				? { date: bestDay.date, text: bestDay.text }
				: null,
		languages,
		days,
	};
};
