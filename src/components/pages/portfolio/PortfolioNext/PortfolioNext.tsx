'use client';
import Link from 'next/link';
import { useState, type FC, type ReactElement } from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import ThemedImage from 'components/utilities/ThemedImage/ThemedImage';
import type { CaseStudyNext } from 'types/caseStudy';

import styles from './PortfolioNext.module.scss';

interface PortfolioNextProps {
	next: CaseStudyNext;
}

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Full-bleed "Next project" link. On hover/focus the next cover clip-wipes up
 * behind the title; on touch the cover sits under the title instead.
 */
const PortfolioNext: FC<PortfolioNextProps> = ({ next }): ReactElement => {
	const [active, setActive] = useState(false);

	return (
		<section className={styles.PortfolioNext} aria-labelledby="next-project">
			<Link
				href={`/portfolio/${next.slug}`}
				className={styles.PortfolioNext__link}
				data-active={active}
				onPointerEnter={() => setActive(true)}
				onPointerLeave={() => setActive(false)}
				onFocus={() => setActive(true)}
				onBlur={() => setActive(false)}
			>
				{next.image && (
					<div className={styles.PortfolioNext__media}>
						<div className={styles.PortfolioNext__image}>
							<ThemedImage
								src={next.image}
								srcDark={next.imageDark}
								alt=""
								fill
								sizes="100vw"
								blurDataURL={next.blurDataURL}
								blurDataURLDark={next.blurDataURLDark}
							/>
						</div>
					</div>
				)}

				<div className={styles.PortfolioNext__top}>
					<h2 id="next-project" className={styles.PortfolioNext__label}>
						Next project
					</h2>
					<span className={styles.PortfolioNext__count}>
						{pad(next.position)}/{pad(next.total)}
					</span>
				</div>

				<div className={styles.PortfolioNext__titleRow}>
					<span className={styles.PortfolioNext__title}>
						<RevealText as="span">{next.title}</RevealText>
					</span>
					<span className={styles.PortfolioNext__arrow} aria-hidden="true">
						→
					</span>
				</div>
			</Link>
		</section>
	);
};

export default PortfolioNext;
