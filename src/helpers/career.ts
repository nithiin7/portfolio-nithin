import { parseCommaSeparatedString } from '.';

/**
 * Interface for raw career data from Contentful
 */
interface RawCareerData {
	data: {
		title?: string;
		subTitle?: string;
	};
	career: {
		sys?: { id: string };
		title?: string;
		company?: string;
		year?: string;
		duration?: string;
		location?: string;
		type?: 'full-time' | 'contract' | 'freelance';
		description?: string;
		technologies?: string;
	}[];
}

/**
 * Interface for transformed career data for HomeCareer component
 */
interface TransformedCareerData {
	data: {
		title?: string;
		subtitle?: string;
	};
	experiences: {
		id: string;
		year: string;
		company: string;
		position: string;
		description: string;
		technologies: string[];
		duration: string;
		location?: string;
		type: 'full-time' | 'contract' | 'freelance';
	}[];
}

/**
 * Transform raw career data from Contentful to match HomeCareer component expectations
 * @param rawData - Raw career data from Contentful
 * @returns Transformed career data
 */
export const transformCareerData = (
	rawData: RawCareerData
): TransformedCareerData => {
	return {
		data: {
			title: rawData.data.title,
			subtitle: rawData.data.subTitle,
		},
		experiences: rawData.career.map((exp) => ({
			id: exp.sys?.id || exp.title || '',
			year: exp.year || '',
			company: exp.company || '',
			position: exp.title || '',
			description: exp.description || '',
			technologies: parseCommaSeparatedString(exp.technologies || ''),
			duration: exp.duration || '',
			location: exp.location,
			type: exp.type || 'full-time',
		})),
	};
};

const MONTHS = [
	'jan',
	'feb',
	'mar',
	'apr',
	'may',
	'jun',
	'jul',
	'aug',
	'sep',
	'oct',
	'nov',
	'dec',
];

// Contentful durations are free text like "July 2022 - October 2023 (1 year 4 months)"
const parseStart = (duration: string): Date | null => {
	const match = duration.match(/([a-z]+)\s+(\d{4})/i);
	if (!match) return null;
	const month = MONTHS.indexOf(match[1].slice(0, 3).toLowerCase());
	if (month === -1) return null;
	return new Date(Number(match[2]), month, 1);
};

/**
 * Whole years since the earliest role started, or null when no duration
 * can be parsed.
 */
export const yearsOfExperience = (
	durations: readonly string[],
	now: Date = new Date()
): number | null => {
	const starts = durations
		.map(parseStart)
		.filter((date): date is Date => date !== null);
	if (starts.length === 0) return null;

	const first = new Date(Math.min(...starts.map((date) => date.getTime())));
	const months =
		(now.getFullYear() - first.getFullYear()) * 12 +
		(now.getMonth() - first.getMonth());
	return Math.floor(months / 12);
};
