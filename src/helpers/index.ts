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
export * from './format';
export * from './scroll';
export * from './string';
export * from './blog';
export * from './social';
export * from './validations';
