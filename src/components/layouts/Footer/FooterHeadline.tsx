'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useRef, type ReactElement } from 'react';

import { useLiteMotion } from 'hooks/useLiteMotion';
import { useMagneticHover } from 'hooks/useMagneticHover';

import styles from './Footer.module.scss';

const CTA_LABEL = 'Let’s talk';

/**
 * "GET IN TOUCH" set to the full measure. The O is the magnetic CTA disc, so
 * the letters are decorative (aria-hidden) and the section's sr-only <h2>
 * carries the heading. The line grows to full size as the footer scrolls
 * into place; under reduced/lite motion it renders at full size.
 */
const FooterHeadline = (): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);
	const lite = useLiteMotion();
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end end'],
	});
	const scale = useTransform(scrollYProgress, [0, 1], [0.84, 1]);

	const { boundsRef, magneticRef } = useMagneticHover<
		HTMLSpanElement,
		HTMLAnchorElement
	>({ strength: 0.35, scale: 1.06 });

	return (
		<div ref={ref} className={styles.Footer__measure}>
			<motion.div
				className={styles.Footer__headline}
				style={{ scale: lite ? 1 : scale }}
			>
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
			</motion.div>
		</div>
	);
};

export default FooterHeadline;
