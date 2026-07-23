import { GITHUB_USERNAME } from 'constants/index';
import type { GithubStats } from 'types/github';

interface GithubRepo {
	name: string;
	html_url: string;
	language: string | null;
	pushed_at: string;
	stargazers_count: number;
	fork: boolean;
}

interface GithubUser {
	followers: number;
}

const TOP_LANGUAGE_COUNT = 5;
const RECENT_REPO_COUNT = 3;

const loadFollowers = async (): Promise<number | null> => {
	try {
		const response = await fetch(
			`https://api.github.com/users/${GITHUB_USERNAME}`,
			{
				headers: { Accept: 'application/vnd.github+json' },
				next: { revalidate: 3600 },
			}
		);

		if (!response.ok) return null;

		const user: GithubUser = await response.json();
		return user.followers;
	} catch {
		return null;
	}
};

export const loadGithubStats = async (): Promise<GithubStats | null> => {
	try {
		const [response, followers] = await Promise.all([
			fetch(
				`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100&type=owner`,
				{
					headers: { Accept: 'application/vnd.github+json' },
					next: { revalidate: 3600 },
				}
			),
			loadFollowers(),
		]);

		if (!response.ok) return null;

		const allRepos: GithubRepo[] = await response.json();
		const repos = allRepos.filter((repo) => !repo.fork);

		if (repos.length === 0) return null;

		const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
			if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
			return acc;
		}, {});

		const topLanguages = Object.entries(languageCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, TOP_LANGUAGE_COUNT)
			.map(([name, count]) => ({ name, count }));

		return {
			repoCount: repos.length,
			totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
			followers,
			topLanguages,
			recentRepos: repos.slice(0, RECENT_REPO_COUNT).map((repo) => ({
				name: repo.name,
				url: repo.html_url,
				language: repo.language,
				pushedAt: repo.pushed_at,
				stars: repo.stargazers_count,
			})),
		};
	} catch {
		return null;
	}
};
