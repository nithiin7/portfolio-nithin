'use client';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { handleScroll } from 'helpers/scroll';
import { useMagneticHover } from 'hooks/useMagneticHover';
import type { SiteLink } from 'types/site';

import styles from './HomeHeader.module.scss';

interface HomeHeaderActionsProps {
	className?: string;
	primary: SiteLink;
	secondary?: SiteLink;
}

/** Primary and secondary hero buttons. */
const HomeHeaderActions = ({
	className,
	primary,
	secondary,
}: HomeHeaderActionsProps): ReactElement => {
	const sectionId = secondary?.url.split('#')[1];
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
					href={primary.url}
					className={styles.HomeHeader__cta}
				>
					<span className={styles.HomeHeader__roll}>
						<span>{primary.label}</span>
						<span aria-hidden="true">{primary.label}</span>
					</span>
					<span className={styles.HomeHeader__arrow} aria-hidden="true">
						→
					</span>
				</Link>
			</div>
			{secondary && (
				<a
					href={sectionId ? `#${sectionId}` : secondary.url}
					className={styles.HomeHeader__secondary}
					onClick={(e) => {
						if (!lenis || !sectionId) return;
						e.preventDefault();
						handleScroll(sectionId, lenis);
					}}
				>
					{secondary.label} <span aria-hidden="true">↓</span>
				</a>
			)}
		</div>
	);
};

export default HomeHeaderActions;
