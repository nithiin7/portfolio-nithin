'use client';
import { useMotionValueEvent, useScroll, useVelocity } from 'motion/react';
import {
	useRef,
	useState,
	type CSSProperties,
	type FC,
	type ReactElement,
} from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import { useLiteMotion } from 'hooks/useLiteMotion';

import styles from './HomeCollaborations.module.scss';

interface HomeCollaborationsProps {
	className?: string;
	data?: {
		title?: string;
	};
}

// Logos are CSS masks over static files in public/logos (tinted by
// currentColor), not inline SVG: the marquee renders every mark twice, which
// put ~80 KB of path data into the HTML, the RSC payload and the JS bundle.
// `ratio` is each file's viewBox width / height.
const collaborators = [
	{
		file: 'ey',
		ratio: '68.67 / 104.22',
		name: 'EY',
		url: 'https://www.ey.com/',
		tall: true,
	},
	{
		file: 'hsbc',
		ratio: '315.9 / 85',
		name: 'HSBC',
		url: 'https://www.hsbc.com/',
	},
	{
		file: 'morgan-stanley',
		ratio: '360 / 90',
		name: 'Morgan Stanley',
		url: 'https://www.morganstanley.com/',
	},
	{
		file: 'paytm-payments-bank',
		ratio: '197.319 / 33.75',
		name: 'Paytm Payments Bank',
		url: 'https://www.paytmbank.com/',
	},
	{
		file: 'spotify',
		ratio: '725.9551 / 251.2245',
		name: 'Spotify',
		url: 'https://connect.spotify.com/',
	},
	{
		file: 'spotify-codes',
		ratio: '134 / 43',
		name: 'Spotify Codes',
		url: 'https://www.spotifycodes.com/',
	},
	{
		file: 'game-awards',
		ratio: '474 / 162',
		name: 'The Game Awards',
		url: 'https://thegameawards.com/',
	},
	{
		file: 'white-rabbit',
		ratio: '41 / 45',
		name: 'White Rabbit',
		url: 'https://whiterabbit.group/',
	},
];

const markStyle = (file: string, ratio: string): CSSProperties =>
	({
		'--logo': `url(/logos/${file}.svg)`,
		'--ratio': ratio,
	}) as CSSProperties;

const MAX_BOOST = 3;

const HomeCollaborations: FC<HomeCollaborationsProps> = ({
	className = '',
	data,
}): ReactElement => {
	const trackRef = useRef<HTMLDivElement>(null);
	const [paused, setPaused] = useState(false);
	const lite = useLiteMotion();

	const { scrollY } = useScroll();
	const velocity = useVelocity(scrollY);

	useMotionValueEvent(velocity, 'change', (v) => {
		if (lite || paused) return;
		// Viewports per second, so the same flick feels the same at 1080p and 4K
		const rate =
			1 + Math.min(Math.abs(v) / (window.innerHeight * 1.6), MAX_BOOST);
		trackRef.current?.getAnimations().forEach((animation) => {
			animation.playbackRate = rate;
		});
	});

	const renderLogos = (copy: boolean) =>
		collaborators.map(({ file, ratio, name, url, tall }) => (
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
					<span
						className={styles.HomeCollaborations__mark}
						style={markStyle(file, ratio)}
						aria-hidden="true"
					/>
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
