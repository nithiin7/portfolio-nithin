/**
 * Format date for display
 * @param dateString - ISO date string
 * @param format - Date format ('long', 'short', 'relative')
 * @returns Formatted date string
 */
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

/**
 * Format a number in compact notation (1284 → 1.3K)
 */
export const formatCompactNumber = (value: number): string =>
	new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);
