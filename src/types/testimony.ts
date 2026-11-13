import type { Company } from 'types/company';

export interface Testimonial {
	id: string;
	review: string;
	avatar: {
		url: string;
	};
	reviewer: string;
	role: string;
	organisation: string;
	company?: Company;
}
