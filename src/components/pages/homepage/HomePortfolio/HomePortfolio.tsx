import type { FC, ReactElement } from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import WorksFeatured from 'components/pages/homepage/WorksFeatured/WorksFeatured';
import WorksIndex from 'components/pages/homepage/WorksIndex/WorksIndex';
import { splitFeatured } from 'helpers/portfolio';
import type { PortfolioItem } from 'types/portfolio';

import styles from './HomePortfolio.module.scss';

interface HomePortfolioProps {
	className?: string;
	data?: {
		title?: string;
	};
	portfolio?: PortfolioItem[];
}

const yearRange = (projects: PortfolioItem[]): string | null => {
	const years = projects
		.map((project) => Number.parseInt(project.year ?? '', 10))
		.filter(Number.isFinite);
	if (years.length === 0) return null;
	const min = Math.min(...years);
	const max = Math.max(...years);
	return min === max ? `${min}` : `${min}–${max}`;
};

const HomePortfolio: FC<HomePortfolioProps> = ({
	className = '',
	data,
	portfolio = [],
}): ReactElement | null => {
	if (portfolio.length === 0) return null;

	const { featured, rest } = splitFeatured(portfolio);
	const range = yearRange(portfolio);

	return (
		<section id="portfolio" className={`${styles.HomePortfolio} ${className}`}>
			<div className={styles.HomePortfolio__inner}>
				<header className={styles.HomePortfolio__head}>
					<p className={styles.HomePortfolio__label}>Selected Works</p>
					<RevealText as="h2" className={styles.HomePortfolio__title}>
						{data?.title || 'Selected Works'}
					</RevealText>
					<p className={styles.HomePortfolio__count}>
						{String(portfolio.length).padStart(2, '0')} projects
						{range && ` · ${range}`}
					</p>
				</header>

				<WorksFeatured projects={featured} />

				{rest.length > 0 && (
					<div className={styles.HomePortfolio__index}>
						<h3 className={styles.HomePortfolio__label}>Index</h3>
						<WorksIndex projects={rest} offset={featured.length} />
					</div>
				)}
			</div>
		</section>
	);
};

export default HomePortfolio;
