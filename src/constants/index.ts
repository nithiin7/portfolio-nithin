import type { LinkIcon } from 'types/site';
import type { LinkItem } from 'types/utils';

export const EXTERNAL_ARROW = '↗\uFE0E';

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

export const MENU_SOCIALS: LinkIcon[] = ['linkedin', 'instagram', 'github'];
