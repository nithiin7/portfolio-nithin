export interface Testimonial {
	id: string;
	review: string;
	avatar: {
		url: string;
	};
	reviewer: string;
	role: string;
	organisation: string;
}
