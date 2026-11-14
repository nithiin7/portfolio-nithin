export type EmploymentType =
	'full-time' | 'contract' | 'freelance' | 'internship';

import type { Company } from 'types/company';

export interface Experience {
	id: string;
	year: string;
	company: string;
	employer?: Company;
	position: string;
	description: string;
	technologies: string[];
	duration: string;
	startDate: string;
	endDate?: string;
	location?: string;
	type: EmploymentType;
}
