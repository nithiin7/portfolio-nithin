import styles from 'styles/home.module.scss';

import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

import { FaAward } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { VscFolderLibrary } from 'react-icons/vsc';

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
		description: '10+ Stacks',
		duration: 1000,
	},
	{
		icon: <FiUsers className={styles['about__icon']} />,
		title: 'Experience',
		description: '7 Months',
		duration: 1100,
	},
	{
		icon: <VscFolderLibrary className={styles['about__icon']} />,
		title: 'Projects',
		description: '5+ Completed',
		duration: 1200,
	},
];
