import type { ReactElement, ReactNode } from 'react';

import { SiteSettingsProvider } from 'contexts/SiteSettingsContext';
import type { SiteSettings } from 'types/site';

/** Site Settings as Contentful returns them, for component tests. */
export const siteFixture: SiteSettings = {
	name: 'Nithin Pradeep',
	role: 'Senior Technical Consultant',
	company: 'EY',
	location: {
		city: 'Bangalore',
		region: 'Karnataka',
		country: 'IN',
		timeZone: 'Asia/Kolkata',
	},
	availability: { open: true, label: 'Available for new projects' },
	email: 'nithinp150@gmail.com',
	socials: [
		{
			label: 'LinkedIn',
			url: 'https://www.linkedin.com/in/nithin-p7/',
			icon: 'linkedin',
		},
		{ label: 'GitHub', url: 'https://github.com/nithiin7', icon: 'github' },
		{
			label: 'Credly',
			url: 'https://www.credly.com/users/nithin-pradeep.53925824',
			icon: 'credly',
		},
	],
	contactChannels: [
		{
			label: 'Email',
			url: 'mailto:nithinp150@gmail.com',
			detail: 'nithinp150@gmail.com',
			icon: 'email',
		},
		{
			label: 'WhatsApp',
			url: 'https://api.whatsapp.com/send?phone=+919645018007',
			detail: '+91-9645018007',
			icon: 'whatsapp',
		},
	],
	knowsAbout: ['AI Agents'],
	seo: { title: 'Nithin Pradeep', description: 'Portfolio.' },
	twitterHandle: '@_nithiin7',
};

export const withSite = (ui: ReactNode): ReactElement => (
	<SiteSettingsProvider value={siteFixture}>{ui}</SiteSettingsProvider>
);
