/**
 * Helper function to parse comma-separated strings into arrays
 * @param str - The comma-separated string to parse
 * @returns Array of trimmed strings
 */
export const parseCommaSeparatedString = (str: string): string[] => {
	if (!str) return [];
	// Remove single quotes and split by comma, then trim whitespace
	return str
		.replace(/'/g, '')
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
};

export {
	convertContentfulBlogPost,
	convertContentfulCategory,
	convertContentfulTag,
	getRichTextContent,
	getImageUrl,
	loadBlogPosts,
	loadBlogPostBySlug,
	loadData,
	loadPortfolioData,
} from './contentful';

export * from './analytics';
export * from './animations';
export * from './blog';
export * from './social';
export * from './validations';
