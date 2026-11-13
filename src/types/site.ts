export type LinkIcon =
	| 'github'
	| 'linkedin'
	| 'instagram'
	| 'x'
	| 'bitbucket'
	| 'credly'
	| 'devto'
	| 'email'
	| 'whatsapp'
	| 'messenger';

export interface SiteLink {
	label: string;
	url: string;
	icon?: LinkIcon;
	/** Second line, e.g. the address shown under "Email". */
	detail?: string;
	openInNewTab?: boolean;
}

export interface Seo {
	title: string;
	description: string;
	ogImage?: string;
	noIndex?: boolean;
}

/** The Contentful Site Settings singleton, flattened for components. */
export interface SiteSettings {
	name: string;
	role: string;
	company: string;
	location: {
		city: string;
		region?: string;
		country: string;
		timeZone: string;
	};
	availability: { open: boolean; label: string };
	email: string;
	socials: SiteLink[];
	contactChannels: SiteLink[];
	knowsAbout: string[];
	seo: Seo;
	twitterHandle?: string;
}
