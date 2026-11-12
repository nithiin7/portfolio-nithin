'use client';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { handleScroll } from 'helpers/scroll';
import { useMagneticHover } from 'hooks/useMagneticHover';

import styles from './HomeHeader.module.scss';

interface HomeHeaderActionsProps {
	className?: string;
}

const CTA_LABEL = 'Start a project';

/** Primary CTA (magnetic, rolling label) + Lenis-driven link to Works. */
const HomeHeaderActions = ({
	className,
}: HomeHeaderActionsProps): ReactElement => {
	const lenis = useLenis();
	const { boundsRef, magneticRef } = useMagneticHover<
		HTMLDivElement,
		HTMLAnchorElement
	>({ strength: 0.25, scale: 1 });

	return (
		<div className={className}>
			<div ref={boundsRef} className={styles.HomeHeader__ctaBounds}>
				<Link
					ref={magneticRef}
					href="/contact"
					className={styles.HomeHeader__cta}
				>
					<span className={styles.HomeHeader__roll}>
						<span>{CTA_LABEL}</span>
						<span aria-hidden="true">{CTA_LABEL}</span>
					</span>
					<span className={styles.HomeHeader__arrow} aria-hidden="true">
						→
					</span>
				</Link>
			</div>
			<a
				href="#portfolio"
				className={styles.HomeHeader__secondary}
				onClick={(e) => {
					if (!lenis) return;
					e.preventDefault();
					handleScroll('portfolio', lenis);
				}}
			>
				See selected work <span aria-hidden="true">↓</span>
			</a>
		</div>
	);
};

export default HomeHeaderActions;
