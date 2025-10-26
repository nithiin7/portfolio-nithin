export interface Certification {
	id?: string;
	name: string;
	provider: string;
	logo: string;
	certificateUrl?: string;
	issuedDate: string;
	expiryDate?: string;
	credentialId?: string;
	description?: string;
	skills?: string[];
}
