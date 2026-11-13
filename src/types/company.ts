/** An organisation from a Contentful Company entry. */
export interface Company {
	name: string;
	slug: string;
	/** https URL of the single-colour SVG, if the entry has one. */
	logoUrl?: string;
	/** Intrinsic width / height of the logo, for optical sizing. */
	ratio: number;
	/** False when the mark doesn't read small: the name is printed instead. */
	showLogo: boolean;
	url?: string;
}
