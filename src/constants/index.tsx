import type { ReactElement } from 'react';
import {
	FaBitbucket,
	FaEnvelope,
	FaFacebookMessenger,
	FaGithub,
	FaLinkedinIn,
	FaWhatsapp,
} from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';
import { IoLogoTwitter } from 'react-icons/io';
import { SiCredly, SiDevdotto } from 'react-icons/si';

import type { LinkIcon } from 'types/site';
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

/** Icon for each Contentful Link `icon` value (socials, contact channels). */
export const LINK_ICONS: Record<LinkIcon, ReactElement> = {
	github: <FaGithub />,
	linkedin: <FaLinkedinIn />,
	instagram: <FiInstagram />,
	x: <IoLogoTwitter />,
	bitbucket: <FaBitbucket />,
	credly: <SiCredly />,
	devto: <SiDevdotto />,
	email: <FaEnvelope />,
	whatsapp: <FaWhatsapp />,
	messenger: <FaFacebookMessenger />,
};

/** Socials shown in the full-screen menu, in this order. */
export const MENU_SOCIALS: LinkIcon[] = ['linkedin', 'instagram', 'github'];
