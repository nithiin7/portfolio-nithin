'use client';
import type { FC } from 'react';
import { useState } from 'react';

import { PortfolioCard, PortfolioModal } from 'components/pages';
import { Button, MaskText } from 'components/utilities';
import type { PortfolioItem } from 'types/portfolio';

import styles from './HomePortfolio.module.scss';

interface HomePortfolioProps {
	className?: string;
	data?: {
		title?: string;
	};
	portfolio?: PortfolioItem[];
}

/**
 * `HomePortfolio` component displays a section with a title and a list of portfolio items.
 * Each portfolio item is rendered using the `PortfolioCard` component.
 *
 * @param {HomePortfolioProps} props - Component properties.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {object} [props.data] - Data containing the title for the section.
 * @param {PortfolioItem[]} [props.portfolio] - List of portfolio items to display.
 * @returns {JSX.Element} - Rendered HomePortfolio component.
 */
const HomePortfolio: FC<HomePortfolioProps> = ({
	className = '',
	data = { title: 'Featured Work' },
	portfolio = [],
}) => {
	const [modal, setModal] = useState({ active: false, index: 0 });
	const [visibleCount, setVisibleCount] = useState(5);

	const ITEMS_PER_PAGE = 5;
	const hasMoreItems = visibleCount < portfolio.length;
	const visiblePortfolio = portfolio.slice(0, visibleCount);

	const handleShowMore = () => {
		setVisibleCount((prev) =>
			Math.min(prev + ITEMS_PER_PAGE, portfolio.length)
		);
	};

	if (!portfolio || portfolio.length === 0) {
		return null;
	}

	return (
		<div className={`${styles.HomePortfolio} ${className}`}>
			<section id="portfolio" className={styles.HomePortfolio}>
				<div className={styles.HomePortfolio__header}>
					<h2 className={styles.HomePortfolio__title}>
						<MaskText phrases={[data.title ?? 'Featured Work']} />
					</h2>
				</div>
				<div className={styles.HomePortfolio__container}>
					<PortfolioModal modal={modal} projects={portfolio} />
					<div className={styles.HomePortfolio__list}>
						{visiblePortfolio.map((project, index) => (
							<PortfolioCard
								key={`${project.title}-${index}`}
								project={project}
								index={index}
								title={project.title}
								setModal={setModal}
							/>
						))}
					</div>
					{hasMoreItems && (
						<div className={styles.HomePortfolio__showMore}>
							<Button
								text="Show More"
								className={styles.HomePortfolio__button}
								onClick={handleShowMore}
							/>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default HomePortfolio;
