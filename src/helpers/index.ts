import type Lenis from 'lenis';

/**
 * Helper function to parse comma-separated strings into arrays
 * @param str - The comma-separated string to parse
 * @returns Array of trimmed strings
 */
export const parseCommaSeparatedString = (str: string): string[] => {
	if (!str) return [];

	return str
		.replace(/'/g, '')
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
};

/**
 * Get rich text content from a Contentful document
 * @param content - The Contentful document
 * @returns Rich text content as a string
 */
export const getRichTextContent = (
	content: { json: Document } | null | undefined
): string => {
	if (!content?.json) return '';

	return JSON.stringify(content.json);
};

/**
 * Get image URL from a Contentful image
 * @param image - The Contentful image
 * @param fallback - Fallback image URL
 * @returns Image URL
 */
export const getImageUrl = (
	image: { url: string } | null | undefined,
	fallback?: string
): string => {
	return image?.url || fallback || '';
};

/**
 * Scrolls to a specified section using Lenis smooth scrolling.
 *
 * Resolves the target's position via the offsetTop/offsetParent chain rather
 * than a selector or getBoundingClientRect: some sections apply a CSS
 * transform (scroll-linked entrance animation) that is still settling when
 * the scroll starts, so a transform-based measurement produces a moving
 * target and the scroll overshoots.
 *
 * @param {string} to - The ID of the section to scroll to.
 */
export const handleScroll = (to: string, lenis: Lenis | undefined) => {
	if (!lenis) return;

	const target = document.getElementById(to);
	if (!target) return;

	let top = 0;
	let el: HTMLElement | null = target;

	while (el) {
		top += el.offsetTop;
		el = el.offsetParent as HTMLElement | null;
	}

	lenis.scrollTo(top, {
		duration: 2,
	});
};

/**
 * Calculate reading time for a given text content
 * @param content - The text content to calculate reading time for
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes
 */
export const calculateReadTime = (
	content: string,
	wordsPerMinute = 200
): number => {
	const words = content.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	return Math.max(1, minutes);
};

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

/**
 * Generate excerpt from content
 * @param content - The full content
 * @param maxLength - Maximum length of excerpt (default: 150 characters)
 * @returns Truncated excerpt
 */
export const generateExcerpt = (content: string, maxLength = 150): string => {
	const plainText = content.replace(/<[^>]*>/g, '');

	if (plainText.length <= maxLength) {
		return plainText;
	}

	return plainText.substring(0, maxLength).trim() + '...';
};

/**
 * Slugify a string for URL-friendly format
 * @param text - The text to slugify
 * @returns URL-friendly slug
 */
export const slugify = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
};

export * from './analytics';
export * from './animations';
export * from './blog';
export * from './social';
export * from './validations';
