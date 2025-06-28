'use client';
import { useState } from 'react';
import type { FC } from 'react';

import PortfolioCard from 'components/pages/PortfolioCard';
import PortfolioModal from 'components/pages/PortfolioModal';
import MaskText from 'components/utilities/MaskText/MaskText';
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

	if (!portfolio || portfolio.length === 0) {
		return null;
	}

	return (
		<div className={`${styles.HomePortfolio} ${className}`}>
			<section id="portfolio" className={styles.portfolio}>
				<div className={styles.portfolio__header}>
					<h2 className={styles.portfolio__title}>
						<MaskText phrases={[data.title ?? 'Featured Work']} />
					</h2>
				</div>
				<div className={styles.portfolio__container}>
					<PortfolioModal modal={modal} projects={portfolio} />
					<div className={styles.portfolio__list}>
						{portfolio.map((project, index) => (
							<PortfolioCard
								key={`${project.title}-${index}`}
								project={project}
								index={index}
								title={project.title}
								setModal={setModal}
							/>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePortfolio;
