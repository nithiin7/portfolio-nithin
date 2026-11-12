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
