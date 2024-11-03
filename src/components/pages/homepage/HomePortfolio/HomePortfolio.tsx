'use client';
import { PortfolioItem } from 'types/portfolio';
import styles from './HomePortfolio.module.scss';

import PortfolioCard from 'components/pages/PortfolioCard';
import MaskText from 'components/utilities/MaskText/MaskText';

interface HomePortfolioProps {
	className?: string;
	data?: {
		title?: string;
	};
	portfolio?: PortfolioItem[];
}

const HomePortfolio: React.FC<HomePortfolioProps> = ({
	className = '',
	data = { title: '' },
	portfolio = [],
}) => {
	return (
		<div className={`${styles.HomePortfolio} ${className}`}>
			<section id="portfolio">
				<h2>
					<MaskText phrases={[data.title || '']} />
				</h2>
				<div className="portfolio__container">
					{portfolio.map((item, index) => (
						<PortfolioCard
							key={index}
							image={item.image.url}
							title={item.title}
							demo={item.demo || ''}
							tech={item.tech || ['']}
							year={item.year}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default HomePortfolio;
