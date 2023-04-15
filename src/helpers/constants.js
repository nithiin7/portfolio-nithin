import styles from 'styles/home.module.scss';

import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

import { FaAward } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { VscFolderLibrary } from 'react-icons/vsc';

import { MdOutlineMail } from 'react-icons/md';
import { RiMessengerLine } from 'react-icons/ri';
import { BsWhatsapp } from 'react-icons/bs';

import { FaFacebookF } from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';
import { IoLogoTwitter } from 'react-icons/io';
import { FaRedditAlien } from 'react-icons/fa';
import { RiSnapchatLine } from 'react-icons/ri';

export const socialMediaLinks = [
	{
		title: 'LinkedIn',
		href: 'https://www.linkedin.com/in/nithin-p7/',
		target: '_blank',
		icon: <BsLinkedin />,
		duration: 1000,
	},
	{
		title: 'GitHub',
		href: 'https://github.com/nithiin7',
		target: '_blank',
		icon: <FaGithub />,
		duration: 1200,
	},
	{
		title: 'Instagram',
		href: 'https://www.instagram.com/__nithiin__/',
		target: '_blank',
		icon: <RiInstagramFill />,
		duration: 1400,
	},
];

export const cardData = [
	{
		icon: <FaAward className={styles['about__icon']} />,
		title: 'Tech Stacks',
		description: '15+ Stacks',
		duration: 1000,
	},
	{
		icon: <FiUsers className={styles['about__icon']} />,
		title: 'Experience',
		description: '1 year',
		duration: 1100,
	},
	{
		icon: <VscFolderLibrary className={styles['about__icon']} />,
		title: 'Projects',
		description: '10+ Completed',
		duration: 1200,
	},
];

export const contactOptions = [
	{
		icon: <MdOutlineMail className={styles['contact__option-icon']} />,
		title: 'Email',
		subtitle: 'nithinp150@gmail.com',
		link: 'mailto:nithinp150@gmail.com',
		duration: 1300,
	},
	{
		icon: <BsWhatsapp className={styles['contact__option-icon']} />,
		title: 'WhatsApp',
		subtitle: '+91-9645018007',
		link: 'https://api.whatsapp.com/send?phone=+919645018007',
		duration: 1400,
	},
	{
		icon: <RiMessengerLine className={styles['contact__option-icon']} />,
		title: 'Messenger',
		subtitle: 'Nithin Pradeep',
		link: 'https://m.me/i.am.np.007',
		duration: 1500,
	},
];

export const footerLinks = [
	{ key: 'home', href: 'home', duration: '1000' },
	{ key: 'about', href: 'about', duration: '1100' },
	{ key: 'experience', href: 'experience', duration: '1200' },
	{ key: 'services', href: 'services', duration: '1300' },
	{ key: 'portfolio', href: 'portfolio', duration: '1400' },
	{ key: 'testimonials', href: 'testimonials', duration: '1500' },
	{ key: 'contact', href: 'contact', duration: '1600' },
];

export const socials = [
	{
		link: 'https://www.facebook.com/i.am.np007/',
		title: 'Facebook',
		icon: <FaFacebookF />,
		duration: 1700,
	},
	{
		link: 'https://www.instagram.com/__nithiin__/',
		title: 'Instagram',
		icon: <FiInstagram />,
		duration: 1800,
	},
	{
		link: 'https://snapchat.com/nithiiin7',
		title: 'Snapchat',
		icon: <RiSnapchatLine />,
		duration: 1900,
	},
	{
		link: 'https://twitter.com/_nithiin7',
		title: 'Twitter',
		icon: <IoLogoTwitter />,
		duration: 2000,
	},
	{
		link: 'https://www.reddit.com/user/nithinp007',
		title: 'Reddit',
		icon: <FaRedditAlien />,
		duration: 2100,
	},
];
