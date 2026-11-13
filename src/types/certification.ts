export interface Certification {
	id?: string;
	name: string;
	provider: string;
	/** Provider logo (SVG asset URL), drawn as a CSS mask. */
	logo: string;
	certificateUrl?: string;
	issuedDate: string;
	expiryDate?: string;
	credentialId?: string;
	description?: string;
	skills?: string[];
	highlight?: boolean;
}
