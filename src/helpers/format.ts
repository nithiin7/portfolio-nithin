/** en-US date: long ("March 15, 2026"), short ("Mar 15, 2026") or relative ("3 days ago"). */
export const formatDate = (
	dateString: string,
	format: 'long' | 'short' | 'relative' = 'long'
): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInDays = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
	);

	switch (format) {
		case 'long':
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		case 'short':
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		case 'relative': {
			if (diffInDays === 0) return 'Today';
			if (diffInDays === 1) return 'Yesterday';
			if (diffInDays < 7) return `${diffInDays} days ago`;

			const weeks = Math.floor(diffInDays / 7);
			if (diffInDays < 30) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;

			const months = Math.floor(diffInDays / 30);
			if (diffInDays < 365)
				return `${months} month${months > 1 ? 's' : ''} ago`;

			const years = Math.floor(diffInDays / 365);
			return `${years} year${years > 1 ? 's' : ''} ago`;
		}
		default:
			return date.toLocaleDateString('en-US');
	}
};

/** Compact number: 1284 → "1.3K". */
export const formatCompactNumber = (value: number): string =>
	new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);

/** Contentful asset URLs are protocol-relative ("//images.ctfassets.net/…"). */
export const httpsUrl = (url: string): string =>
	url.startsWith('//') ? `https:${url}` : url;
