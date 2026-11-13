'use client';
import { useMotionValueEvent, useScroll, useVelocity } from 'motion/react';
import {
	useRef,
	useState,
	type CSSProperties,
	type FC,
	type ReactElement,
} from 'react';

import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import { useLiteMotion } from 'hooks/useLiteMotion';
import type { Collaborator } from 'types/home';

import styles from './HomeCollaborations.module.scss';

interface HomeCollaborationsProps {
	className?: string;
	data?: {
		title?: string;
	};
	collaborators?: Collaborator[];
}

// Logos are CSS masks over the Contentful SVG (tinted by currentColor), not
// inline SVG: the marquee renders every mark twice, which put ~80 KB of path
// data into the HTML, the RSC payload and the JS bundle.
const markStyle = (logoUrl: string, ratio: string): CSSProperties =>
	({
		'--logo': `url("${logoUrl}")`,
		'--ratio': ratio,
	}) as CSSProperties;

const MAX_BOOST = 3;

const HomeCollaborations: FC<HomeCollaborationsProps> = ({
	className = '',
	data,
	collaborators = [],
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
		collaborators.map(({ logoUrl, ratio, name, url, tall }) => (
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
						style={markStyle(logoUrl, ratio)}
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
						<ScrambleText
							as="span"
							text={data?.title || 'Brands I’ve built for.'}
						/>
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
