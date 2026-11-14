import { DEVTO_USERNAME } from 'constants/index';
import { fetchJson } from 'helpers/http';
import type { DevToStats } from 'types/devto';

interface DevToArticle {
	title: string;
	url: string;
	public_reactions_count: number;
	comments_count: number;
	published_at: string;
}

export const loadDevToStats = async (): Promise<DevToStats | null> => {
	const articles = await fetchJson<DevToArticle[]>(
		`https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=100`,
		{ next: { revalidate: 3600 } }
	);

	const [latest] = articles ?? [];
	if (!articles || !latest) return null;

	return {
		totalArticles: articles.length,
		totalReactions: articles.reduce(
			(sum, article) => sum + article.public_reactions_count,
			0
		),
		totalComments: articles.reduce(
			(sum, article) => sum + article.comments_count,
			0
		),
		latest: {
			title: latest.title,
			url: latest.url,
			reactionsCount: latest.public_reactions_count,
			commentsCount: latest.comments_count,
			publishedAt: latest.published_at,
		},
	};
};
