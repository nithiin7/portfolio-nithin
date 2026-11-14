'use client';
import Link from 'next/link';
import type { FC, ReactElement } from 'react';
import { useInView } from 'react-intersection-observer';

import RevealImage from 'components/motion/RevealImage/RevealImage';
import WorksMedia from 'components/pages/homepage/WorksMedia/WorksMedia';
import { portfolioHref } from 'helpers/portfolio';
import type { PortfolioItem } from 'types/portfolio';

import styles from './WorksFeatured.module.scss';

interface WorksFeaturedProps {
	projects: PortfolioItem[];
}

interface FeaturedCardProps {
	project: PortfolioItem;
	index: number;
}

const LEAD_SIZES = '100vw';
const CARD_SIZES = '(min-width: 768px) 50vw, 100vw';

const FeaturedCard: FC<FeaturedCardProps> = ({
	project,
	index,
}): ReactElement => {
	const { ref: playRef, inView: playing } = useInView({ threshold: 0.5 });
	const meta = [project.type, project.role, project.year].filter(Boolean);

	return (
		<li className={styles.WorksFeatured__item} data-lead={index === 0}>
			<Link
				href={portfolioHref(project)}
				className={styles.WorksFeatured__card}
			>
				<div ref={playRef} className={styles.WorksFeatured__frame}>
					<RevealImage className={styles.WorksFeatured__reveal}>
						<WorksMedia
							project={project}
							sizes={index === 0 ? LEAD_SIZES : CARD_SIZES}
							playing={playing}
							className={styles.WorksFeatured__media}
						/>
					</RevealImage>
				</div>
				<div className={styles.WorksFeatured__body}>
					<span className={styles.WorksFeatured__number} aria-hidden="true">
						{String(index + 1).padStart(2, '0')}
					</span>
					<div className={styles.WorksFeatured__text}>
						<h3 className={styles.WorksFeatured__title}>
							<span className={styles.WorksFeatured__titleText}>
								{project.title}
							</span>
						</h3>
						{project.summary && (
							<p className={styles.WorksFeatured__summary}>{project.summary}</p>
						)}
					</div>
					<dl className={styles.WorksFeatured__meta}>
						{meta.length > 0 && (
							<div>
								<dt className={styles.WorksFeatured__sr}>Details</dt>
								<dd>{meta.join(' · ')}</dd>
							</div>
						)}
						{project.tech && project.tech.length > 0 && (
							<div>
								<dt className={styles.WorksFeatured__sr}>Stack</dt>
								<dd className={styles.WorksFeatured__stack}>
									{project.tech.join(', ')}
								</dd>
							</div>
						)}
					</dl>
				</div>
			</Link>
		</li>
	);
};

const WorksFeatured: FC<WorksFeaturedProps> = ({ projects }): ReactElement => (
	<ul className={styles.WorksFeatured} aria-label="Featured projects">
		{projects.map((project, index) => (
			<FeaturedCard
				key={project.id ?? project.title}
				project={project}
				index={index}
			/>
		))}
	</ul>
);

export default WorksFeatured;
