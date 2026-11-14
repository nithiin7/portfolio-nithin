/** Parses the date part of an ISO string as a UTC calendar day. */
export const calendarDay = (iso: string): Date => {
	const day = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
	return day
		? new Date(Date.UTC(Number(day[1]), Number(day[2]) - 1, Number(day[3])))
		: new Date(iso);
};

/** Formats a date as long, short or relative text. */
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
			return calendarDay(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC',
			});
		case 'short':
			return calendarDay(dateString).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				timeZone: 'UTC',
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

/** Formats a number compactly, e.g. 1.2K. */
export const formatCompactNumber = (value: number): string =>
	new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);

/** Adds https: to protocol-relative URLs. */
export const httpsUrl = (url: string): string =>
	url.startsWith('//') ? `https:${url}` : url;
