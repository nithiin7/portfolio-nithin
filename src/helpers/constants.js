import { getExperience } from 'helpers';

import { FaAward, FaGithub, FaBitbucket, FaLinkedinIn } from 'react-icons/fa';
import { FiUsers, FiInstagram } from 'react-icons/fi';
import { VscFolderLibrary } from 'react-icons/vsc';
import { IoLogoTwitter } from 'react-icons/io';

export const cardData = [
	{
		icon: <FaAward className={'about__icon'} />,
		title: 'Tech Stacks',
		description: '15+ Stacks',
		duration: 1000,
	},
	{
		icon: <FiUsers className={'about__icon'} />,
		title: 'Experience',
		description: getExperience('July 2022'),
		duration: 1100,
	},
	{
		icon: <VscFolderLibrary className={'about__icon'} />,
		title: 'Projects',
		description: '15+ Completed',
		duration: 1200,
	},
];

export const contactOptions = [
	{
		subtitle: 'nithinp150@gmail.com',
		link: 'mailto:nithinp150@gmail.com',
	},
	{
		subtitle: '+91-9645018007',
		link: 'https://api.whatsapp.com/send?phone=+919645018007',
	},
	{
		subtitle: 'Nithin Pradeep',
		link: 'https://m.me/i.am.np.007',
	},
];

export const footerLinks = [
	{ key: 'home', href: 'home' },
	{ key: 'services', href: 'services' },
	{ key: 'about', href: 'about' },
	{ key: 'portfolio', href: 'portfolio' },
	{ key: 'collaborations', href: 'collaborations' },
	{
		key: 'testimonials',
		href: 'testimonials',
	},
];

export const socials = [
	{
		link: 'https://www.instagram.com/__nithiin__/',
		title: 'Instagram',
		icon: <FiInstagram />,
	},
	{
		link: 'https://twitter.com/_nithiin7',
		title: 'Twitter',
		icon: <IoLogoTwitter />,
	},
	{
		link: 'https://www.linkedin.com/in/nithin-p7/',
		title: 'LinkedIn',
		icon: <FaLinkedinIn />,
	},
	{
		link: 'https://bitbucket.org/nithin-private/workspace/repositories/',
		title: 'LinkedIn',
		icon: <FaBitbucket />,
	},
	{
		link: 'https://github.com/nithiin7',
		title: 'LinkedIn',
		icon: <FaGithub />,
	},
];

export const songs = [
	{
		name: 'Feels by Calvin Harris',
		link: 'https://open.spotify.com/track/5bcTCxgc7xVfSaMV3RuVke?si=64c199169ff3495f',
	},
	{
		name: 'Timber by Pitbull ft Kesha',
		link: 'https://open.spotify.com/track/3tgZ9vmhuAY9wEoNUJskzV?si=6e459ddcaabc4f0c',
	},
	{
		name: 'Shut It Down by Akon',
		link: 'https://open.spotify.com/track/6r9uMZ7NBaMO1ovylcJZI4?si=56a0983ba4474bac',
	},
	{
		name: 'Break Free by Ariana Grande',
		link: 'https://open.spotify.com/track/12KUFSHFgT0XCoiSlvdQi4?si=62f8f2efe0ff4f45',
	},
	{
		name: 'Call Me Maybe by Carly Rae',
		link: 'https://open.spotify.com/track/20I6sIOMTCkB6w7ryavxtO?si=f4543aad21f145ba',
	},
];
