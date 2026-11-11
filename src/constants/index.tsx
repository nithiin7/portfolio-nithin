import { FaGithub, FaBitbucket, FaLinkedinIn } from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';
import { IoLogoTwitter } from 'react-icons/io';
import { SiCredly, SiDevdotto } from 'react-icons/si';

import { siteConfig } from 'config/site';
import type { Contact } from 'types/contact';
import type { Social } from 'types/social';
import type { LinkItem } from 'types/utils';

export const GITHUB_USERNAME = 'nithiin7';
export const DEVTO_USERNAME = 'nithiin7';
export const HUGGINGFACE_SPACE_ID = 'nithiin7/Portfolio_Resume';

export const links: LinkItem[] = [
	{ title: 'About', href: '/#about' },
	{ title: 'Blogs', href: '/blog' },
	{ title: 'Companies', href: '/#collaborations' },
	{ title: 'Services', href: '/#services' },
	{ title: 'Works', href: '/#portfolio' },
	{ title: 'Certifications', href: '/#certifications' },
];

export const navLinks: LinkItem[] = [
	{ title: 'Work', href: '/#portfolio' },
	{ title: 'About', href: '/#about' },
	{ title: 'Blog', href: '/blog' },
	{ title: 'Stats', href: '/stats' },
	{ title: 'Contact', href: '/contact' },
];

export const socialsMenu: LinkItem[] = [
	{ title: 'Linkedin', href: siteConfig.socials.linkedin },
	{ title: 'Instagram', href: siteConfig.socials.instagram },
	{ title: 'Github', href: siteConfig.socials.github },
];

export const contactOptions: Contact[] = [
	{
		label: 'Email',
		subtitle: siteConfig.email,
		link: `mailto:${siteConfig.email}`,
	},
	{
		label: 'WhatsApp',
		subtitle: '+91-9645018007',
		link: 'https://api.whatsapp.com/send?phone=+919645018007',
	},
	{
		label: 'Messenger',
		subtitle: 'Nithin Pradeep',
		link: 'https://m.me/i.am.np.007',
	},
];

export const socials: Social[] = [
	{
		link: siteConfig.socials.instagram,
		title: 'Instagram',
		icon: <FiInstagram />,
	},
	{
		link: siteConfig.socials.twitter,
		title: 'Twitter',
		icon: <IoLogoTwitter />,
	},
	{
		link: siteConfig.socials.linkedin,
		title: 'LinkedIn',
		icon: <FaLinkedinIn />,
	},
	{
		link: 'https://bitbucket.org/nithin-private/workspace/repositories/',
		title: 'Bitbucket',
		icon: <FaBitbucket />,
	},
	{ link: siteConfig.socials.github, title: 'Github', icon: <FaGithub /> },
	{
		link: siteConfig.socials.credly,
		title: 'Credly',
		icon: <SiCredly />,
	},
	{
		link: 'https://dev.to/nithiin7',
		title: 'DEV',
		icon: <SiDevdotto />,
	},
];
