'use client';

import { useLenis } from '@studio-freight/react-lenis';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';

import { FooterBackground, SpotifyIcon } from 'assets/icons';
import { FooterLogo } from 'assets/logos/FooterLogo';
import { MagneticButton } from 'components/utilities';
import { footerLinks, socials, songs } from 'constants/index';
import { useTheme } from 'contexts/ThemeContext';
import type { Social } from 'types/social';
import type { Song } from 'types/song';
import type { FooterLink } from 'types/utils';

import styles from './Footer.module.scss';

/**
 * Footer component displaying various links, social icons, and a randomly selected song.
 * Includes a contact link if on the homepage.
 *
 * @component
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = (): ReactElement => {
	const [randomSong, setRandomSong] = useState<Song | null>(null);
	const lenis = useLenis();
	const pathname = usePathname();
	const { theme } = useTheme();

	/**
	 * Selects a random song from the songs array.
	 *
	 * @returns {Song} A random song object.
	 */
	const getRandomSong = (): Song => {
		const randomIndex = Math.floor(Math.random() * songs.length);
		return songs[randomIndex];
	};

	/**
	 * Scrolls to a specified section using Lenis smooth scrolling.
	 *
	 * @param {string} to - The ID of the section to scroll to.
	 */
	const handleScroll = (to: string) => {
		if (lenis) {
			lenis.scrollTo(`#${to}`, {
				duration: 2,
			});
		}
	};

	useEffect(() => {
		const randomSong = getRandomSong();
		setRandomSong(randomSong);
	}, []);

	return (
		<footer className={styles['footer']}>
			{pathname === '/' && (
				<div className={styles['footer__contact']}>
					<span>Got a project? Need an unfair advantage?</span>
					<Link href={'/contact'} title="Contact">
						<FooterLogo theme={theme} />
					</Link>
				</div>
			)}
			<FooterBackground className={styles['footer__bg']} />
			<div className={styles['footer__column']}>
				<div className={styles['footer__music']}>
					<div className={styles['music__spotify']}>
						<SpotifyIcon />
					</div>
					<div className={styles['music__title']}>
						<h2>On repeat</h2>
						{randomSong && (
							<span>
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={randomSong.link}
									title={randomSong.name}
								>
									{randomSong.name}
								</a>
							</span>
						)}
					</div>
				</div>
			</div>
			{pathname === '/' && (
				<ul className={styles['footer__permalinks']}>
					{footerLinks.map((link: FooterLink) => (
						<li key={link.key}>
							<ScrollLink
								to={link.href}
								href={`#${link.href}`}
								onClick={() => {
									handleScroll(link.href);
								}}
							>
								{link.key}
							</ScrollLink>
						</li>
					))}
				</ul>
			)}
			<div className={styles['footer__socials']}>
				{socials.map((social: Social, index: number) => (
					<MagneticButton
						key={index}
						href={social.link}
						title={social.title}
						className={styles['social-link']}
					>
						{social.icon}
					</MagneticButton>
				))}
			</div>
			<div className={styles['footer__copyright']}>
				<small>&copy; Nithin Pradeep. All rights reserved</small>
			</div>
		</footer>
	);
};

export default Footer;
