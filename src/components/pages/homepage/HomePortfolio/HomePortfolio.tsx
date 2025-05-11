'use client';
import type { FC } from 'react';

import PortfolioCard from 'components/pages/PortfolioCard';
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
	data = { title: '' },
	portfolio = [],
}) => {
	return (
		<div className={`${styles.HomePortfolio} ${className}`}>
			<section id="portfolio">
				<h2>
					<MaskText phrases={[data.title ?? '']} />
				</h2>
				<div className={styles.portfolio__container}>
					{portfolio.map((item, index) => (
						<PortfolioCard
							key={index}
							image={item.image.url}
							title={item.title}
							demo={item.demo ?? ''}
							tech={item.tech ?? ['']}
							year={item.year}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default HomePortfolio;
