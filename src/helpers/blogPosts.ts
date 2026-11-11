import type { BlogPost } from 'types/blog';

export interface BlogFilter {
	category?: string | null;
	tags?: string[];
	query?: string;
}

export interface CategoryCount {
	name: string;
	count: number;
}

/**
 * Categories as they appear on posts, most-used first. Derived from the posts
 * rather than the BlogCategory collection, whose names don't match the
 * free-text `category` field authors actually fill in.
 */
export const categoriesFromPosts = (posts: BlogPost[]): CategoryCount[] => {
	const counts = new Map<string, number>();
	for (const post of posts) {
		if (post.category) {
			counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
		}
	}
	return [...counts]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const filterPosts = (
	posts: BlogPost[],
	{ category, tags = [], query = '' }: BlogFilter
): BlogPost[] => {
	const needle = query.trim().toLowerCase();
	return posts.filter((post) => {
		if (category && post.category !== category) return false;
		if (tags.some((tag) => !post.tags.includes(tag))) return false;
		if (!needle) return true;
		return [post.title, post.excerpt, post.category, ...post.tags].some(
			(field) => field?.toLowerCase().includes(needle)
		);
	});
};

export const isFiltering = ({
	category,
	tags = [],
	query = '',
}: BlogFilter): boolean =>
	Boolean(category) || tags.length > 0 || query.trim().length > 0;

const dateFormats = {
	short: new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	}),
	long: new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}),
} as const;

/** UTC so server and client render the same day and hydration matches. */
export const formatPostDate = (
	iso: string,
	style: keyof typeof dateFormats = 'short'
): string => {
	const date = new Date(iso);
	return Number.isNaN(date.getTime()) ? '' : dateFormats[style].format(date);
};
