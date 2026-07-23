export interface DevToArticleSummary {
	title: string;
	url: string;
	reactionsCount: number;
	commentsCount: number;
	publishedAt: string;
}

export interface DevToStats {
	totalArticles: number;
	totalReactions: number;
	totalComments: number;
	latest: DevToArticleSummary;
}
