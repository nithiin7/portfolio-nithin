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
		description: string[];
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
			description: parseCommaSeparatedString(exp.description || ''),
			technologies: parseCommaSeparatedString(exp.technologies || ''),
			duration: exp.duration || '',
			location: exp.location,
			type: exp.type || 'full-time',
		})),
	};
};
