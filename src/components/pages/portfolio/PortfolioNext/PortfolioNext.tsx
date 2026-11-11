'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, ViewTransition, type FC, type ReactElement } from 'react';

import { RevealText } from 'components/motion';
import { useMediaQuery } from 'hooks/useMediaQuery';
import type { CaseStudyNext } from 'types/caseStudy';

import styles from './PortfolioNext.module.scss';

interface PortfolioNextProps {
	next: CaseStudyNext;
}

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Full-bleed "Next project" link. On hover/focus the next cover clip-wipes up
 * behind the title; on touch the cover sits under the title instead. The
 * cover morphs into the next page's hero via the shared view-transition name.
 */
const PortfolioNext: FC<PortfolioNextProps> = ({ next }): ReactElement => {
	const [active, setActive] = useState(false);
	const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
	// Named only while visible: a clipped cover at capture would blank the morph
	const imageName =
		!canHover || active ? `portfolio-image-${next.id}` : undefined;

	return (
		<section className={styles.PortfolioNext} aria-labelledby="next-project">
			<Link
				href={`/portfolio/${next.id}`}
				className={styles.PortfolioNext__link}
				data-active={active}
				onPointerEnter={() => setActive(true)}
				onPointerLeave={() => setActive(false)}
				onFocus={() => setActive(true)}
				onBlur={() => setActive(false)}
			>
				{next.image && (
					<div className={styles.PortfolioNext__media}>
						<ViewTransition
							name={imageName}
							share="portfolio-image-morph"
							enter="none"
							exit="none"
							update="none"
						>
							<div className={styles.PortfolioNext__image}>
								<Image
									src={next.image}
									alt=""
									fill
									sizes="100vw"
									placeholder={next.blurDataURL ? 'blur' : 'empty'}
									blurDataURL={next.blurDataURL}
								/>
							</div>
						</ViewTransition>
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
					<ViewTransition
						name={`portfolio-title-${next.id}`}
						share="portfolio-title-morph"
						enter="none"
						exit="none"
						update="none"
					>
						<span className={styles.PortfolioNext__title}>
							<RevealText as="span">{next.title}</RevealText>
						</span>
					</ViewTransition>
					<span className={styles.PortfolioNext__arrow} aria-hidden="true">
						→
					</span>
				</div>
			</Link>
		</section>
	);
};

export default PortfolioNext;
