export interface Testimonial {
	id: number;
	review: string;
	avatar: {
		url: string;
	};
	reviewer: string;
	institution: string;
}
