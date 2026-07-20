'use client';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import { EqualizerIcon, FooterBackground, SpotifyIcon } from 'assets/icons';
import { FooterLogo } from 'assets/logos/FooterLogo';
import { MagneticButton } from 'components/utilities';
import { footerLinks, socials, songs } from 'constants/index';
import { useTheme } from 'contexts/ThemeContext';
import { handleScroll } from 'helpers';
import type { Social } from 'types/social';
import type { Song } from 'types/song';
import type { FooterLink } from 'types/utils';

import styles from './Footer.module.scss';

const MARQUEE_GAP = 48;
const MARQUEE_SPEED = 50;

/**
 * Footer component displaying various links, social icons, and a randomly selected song.
 * Includes a contact link if on the homepage.
 *
 * @component
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = (): ReactElement => {
	const [randomSong, setRandomSong] = useState<Song | null>(null);
	const [marqueeDistance, setMarqueeDistance] = useState(0);
	const marqueeRef = useRef<HTMLDivElement>(null);
	const songNameRef = useRef<HTMLAnchorElement>(null);
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

	useEffect(() => {
		const randomSong = getRandomSong();
		setRandomSong(randomSong);
	}, []);

	useEffect(() => {
		if (!randomSong || !marqueeRef.current || !songNameRef.current) {
			setMarqueeDistance(0);
			return;
		}

		const overflow =
			songNameRef.current.scrollWidth > marqueeRef.current.clientWidth;

		setMarqueeDistance(
			overflow ? songNameRef.current.scrollWidth + MARQUEE_GAP : 0
		);
	}, [randomSong]);

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
			{pathname === '/' || pathname === '/contact' ? (
				<FooterBackground className={styles['footer__bg']} />
			) : null}
			<div className={styles['footer__column']}>
				<div className={styles['footer__music']}>
					<div className={styles['music__spotify']}>
						<SpotifyIcon />
					</div>
					<div className={styles['music__title']}>
						<div className={styles['music__heading']}>
							<h2>On repeat</h2>
							{randomSong && (
								<span className={styles['music__equalizer']} aria-hidden="true">
									<EqualizerIcon />
								</span>
							)}
						</div>
						{randomSong && (
							<div className={styles['music__marquee']} ref={marqueeRef}>
								<div
									className={`${styles['music__marqueeTrack']} ${
										marqueeDistance
											? styles['music__marqueeTrack--scrolling']
											: ''
									}`}
									style={
										marqueeDistance
											? ({
													'--marquee-distance': `${marqueeDistance}px`,
													animationDuration: `${
														marqueeDistance / MARQUEE_SPEED
													}s`,
												} as React.CSSProperties)
											: undefined
									}
								>
									<a
										ref={songNameRef}
										target="_blank"
										rel="noopener noreferrer"
										href={randomSong.link}
										title={randomSong.name}
									>
										{randomSong.name}
									</a>
									{marqueeDistance > 0 && (
										<a
											aria-hidden="true"
											tabIndex={-1}
											target="_blank"
											rel="noopener noreferrer"
											href={randomSong.link}
										>
											{randomSong.name}
										</a>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{pathname === '/' && (
				<ul className={styles['footer__permalinks']}>
					{footerLinks.map((link: FooterLink) => (
						<li key={link.key}>
							<a
								href={`#${link.href}`}
								data-text={link.key}
								onClick={(event) => {
									event.preventDefault();
									handleScroll(link.href, lenis);
								}}
							>
								{link.key}
							</a>
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
