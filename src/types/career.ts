export interface Experience {
	id: string;
	year: string;
	company: string;
	position: string;
	description: string[];
	technologies: string[];
	duration: string;
	location?: string;
	type: 'full-time' | 'contract' | 'freelance';
}
