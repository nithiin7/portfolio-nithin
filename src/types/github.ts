export interface GithubRecentRepo {
	name: string;
	url: string;
	language: string | null;
	pushedAt: string;
	stars: number;
}

export interface GithubLanguageStat {
	name: string;
	count: number;
}

export interface GithubStats {
	repoCount: number;
	totalStars: number;
	followers: number | null;
	topLanguages: GithubLanguageStat[];
	recentRepos: GithubRecentRepo[];
}
