'use client';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { useMagneticHover } from 'hooks/useMagneticHover';

import styles from './Footer.module.scss';

const CTA_LABEL = 'Let’s talk';

/**
 * "GET IN TOUCH" set to the full measure. The O is the magnetic CTA disc, so
 * the letters are decorative (aria-hidden) and the section's sr-only <h2>
 * carries the heading.
 */
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
