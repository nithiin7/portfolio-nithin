'use client';
import { useMotionValueEvent, useScroll, useVelocity } from 'motion/react';
import { useRef, useState, type FC, type ReactElement } from 'react';

import ScrambleText from 'components/motion/ScrambleText/ScrambleText';
import CompanyLogo from 'components/utilities/CompanyLogo/CompanyLogo';
import { useLiteMotion } from 'hooks/useLiteMotion';
import type { Company } from 'types/company';

import styles from './HomeCollaborations.module.scss';

interface HomeCollaborationsProps {
	className?: string;
	data?: {
		title?: string;
	};
	collaborators?: Company[];
}

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
		collaborators.map((company) => (
			<li key={company.slug} className={styles.HomeCollaborations__item}>
				<CompanyLogo
					company={company}
					size="lg"
					linked
					className={styles.HomeCollaborations__logo}
					tabIndex={copy ? -1 : undefined}
				/>
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
