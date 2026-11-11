'use client';
import {
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useVelocity,
} from 'motion/react';
import { useRef, useState, type FC, type ReactElement } from 'react';

import EYLogo from 'assets/logos/ey.svg';
import GameAwardsLogo from 'assets/logos/game-awards.svg';
import HSBCLogo from 'assets/logos/hsbc.svg';
import MorganStanleyLogo from 'assets/logos/morgan-stanley.svg';
import PaytmLogo from 'assets/logos/paytm-payments-bank.svg';
import SpotifyCodesLogo from 'assets/logos/spotify-codes.svg';
import SpotifyLogo from 'assets/logos/spotify.svg';
import WhiteRabbitLogo from 'assets/logos/white-rabbit.svg';
import { RevealText } from 'components/motion';

import styles from './HomeCollaborations.module.scss';

interface HomeCollaborationsProps {
	className?: string;
	data?: {
		title?: string;
	};
}

const collaborators = [
	{ Logo: EYLogo, name: 'EY', url: 'https://www.ey.com/', tall: true },
	{ Logo: HSBCLogo, name: 'HSBC', url: 'https://www.hsbc.com/' },
	{
		Logo: MorganStanleyLogo,
		name: 'Morgan Stanley',
		url: 'https://www.morganstanley.com/',
	},
	{
		Logo: PaytmLogo,
		name: 'Paytm Payments Bank',
		url: 'https://www.paytmbank.com/',
	},
	{ Logo: SpotifyLogo, name: 'Spotify', url: 'https://connect.spotify.com/' },
	{
		Logo: SpotifyCodesLogo,
		name: 'Spotify Codes',
		url: 'https://www.spotifycodes.com/',
	},
	{
		Logo: GameAwardsLogo,
		name: 'The Game Awards',
		url: 'https://thegameawards.com/',
	},
	{
		Logo: WhiteRabbitLogo,
		name: 'White Rabbit',
		url: 'https://whiterabbit.group/',
	},
];

const MAX_BOOST = 3;

const HomeCollaborations: FC<HomeCollaborationsProps> = ({
	className = '',
	data,
}): ReactElement => {
	const trackRef = useRef<HTMLDivElement>(null);
	const [paused, setPaused] = useState(false);
	const reduced = useReducedMotion();

	const { scrollY } = useScroll();
	const velocity = useVelocity(scrollY);

	useMotionValueEvent(velocity, 'change', (v) => {
		if (reduced || paused) return;
		const rate = 1 + Math.min(Math.abs(v) / 1500, MAX_BOOST);
		trackRef.current?.getAnimations().forEach((animation) => {
			animation.playbackRate = rate;
		});
	});

	const renderLogos = (copy: boolean) =>
		collaborators.map(({ Logo, name, url, tall }) => (
			<li key={name} className={styles.HomeCollaborations__item}>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className={`${styles.HomeCollaborations__logo} ${
						tall ? styles['HomeCollaborations__logo--tall'] : ''
					}`}
					tabIndex={copy ? -1 : undefined}
				>
					<Logo aria-hidden="true" focusable="false" />
					<span className={styles.HomeCollaborations__srOnly}>
						{name} (opens in a new tab)
					</span>
				</a>
			</li>
		));

	return (
		<section
			id="collaborations"
			className={`${styles.HomeCollaborations} ${className}`}
		>
			<div className={styles.HomeCollaborations__inner}>
				<header className={styles.HomeCollaborations__head}>
					<p className={styles.HomeCollaborations__label}>Collaborations</p>
					<h2 className={styles.HomeCollaborations__title}>
						<span className={styles.HomeCollaborations__number}>
							{String(collaborators.length).padStart(2, '0')}
						</span>{' '}
						<RevealText as="span">
							{data?.title || 'Brands I’ve built for.'}
						</RevealText>
					</h2>
					<button
						type="button"
						className={styles.HomeCollaborations__toggle}
						aria-pressed={paused}
						onClick={() => setPaused((p) => !p)}
					>
						{paused ? 'Play' : 'Pause'}
						<span className={styles.HomeCollaborations__srOnly}>
							{' '}
							logo marquee
						</span>
					</button>
				</header>
			</div>

			<div
				className={`${styles.HomeCollaborations__marquee} ${
					paused ? styles['HomeCollaborations__marquee--paused'] : ''
				}`}
			>
				<div ref={trackRef} className={styles.HomeCollaborations__track}>
					<ul className={styles.HomeCollaborations__list}>
						{renderLogos(false)}
					</ul>
					<ul
						className={`${styles.HomeCollaborations__list} ${styles['HomeCollaborations__list--copy']}`}
						aria-hidden="true"
					>
						{renderLogos(true)}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default HomeCollaborations;
