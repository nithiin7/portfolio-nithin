export type EmploymentType =
	'full-time' | 'contract' | 'freelance' | 'internship';

export interface Experience {
	id: string;
	/** Start year, e.g. "2026". */
	year: string;
	company: string;
	position: string;
	description: string;
	technologies: string[];
	/** Display range, e.g. "Aug 2026 – Present". */
	duration: string;
	startDate: string;
	endDate?: string;
	location?: string;
	type: EmploymentType;
}
