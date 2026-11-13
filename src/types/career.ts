export type EmploymentType =
	'full-time' | 'contract' | 'freelance' | 'internship';

import type { Company } from 'types/company';

export interface Experience {
	id: string;
	/** Start year, e.g. "2026". */
	year: string;
	company: string;
	employer?: Company;
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
