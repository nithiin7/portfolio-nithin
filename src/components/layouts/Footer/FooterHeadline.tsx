'use client';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { useMagneticHover } from 'hooks/useMagneticHover';

import styles from './Footer.module.scss';

const CTA_LABEL = 'Let’s talk';

/** Large "Let's talk" headline with a magnetic contact link. */
const FooterHeadline = (): ReactElement => {
	const { boundsRef, magneticRef } = useMagneticHover<
		HTMLSpanElement,
		HTMLAnchorElement
	>({ strength: 0.35, scale: 1.06 });

	return (
		<div className={styles.Footer__measure}>
			<div className={styles.Footer__headline}>
				<span className={styles.Footer__word} aria-hidden="true">
					Get in
				</span>
				<span className={styles.Footer__word}>
					<span aria-hidden="true">T</span>
					<span ref={boundsRef} className={styles.Footer__o}>
						<Link
							ref={magneticRef}
							href="/contact"
							className={styles.Footer__disc}
						>
							<span className={styles.Footer__discLabel}>{CTA_LABEL}</span>
							<span className={styles.Footer__discArrow} aria-hidden="true">
								→
							</span>
						</Link>
					</span>
					<span aria-hidden="true">uch</span>
				</span>
			</div>
		</div>
	);
};

export default FooterHeadline;
