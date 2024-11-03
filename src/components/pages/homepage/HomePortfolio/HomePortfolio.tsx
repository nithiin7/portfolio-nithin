'use client';
import PropTypes from 'prop-types';
import styles from './HomePortfolio.module.scss';

import PortfolioCard from 'components/pages/PortfolioCard';
import MaskText from 'components/utilities/MaskText/MaskText';

const HomePortfolio = ({ className = '', data = {}, portfolio = {} }) => {
	return (
		<div className={`${styles.HomePortfolio} ${className}`}>
			<section id="portfolio">
				<h2>
					<MaskText phrases={[data.title]} />
				</h2>
				<div className="portfolio__container">
					{portfolio.map((item, index) => {
						return (
							<PortfolioCard
								key={index}
								image={item.image.url}
								title={item.title}
								github={item.gitHub}
								demo={item.demo}
								tech={item.tech}
								year={item.year}
							/>
						);
					})}
				</div>
			</section>
		</div>
	);
};

HomePortfolio.propTypes = {
	className: PropTypes.string,
	data: PropTypes.object,
	portfolio: PropTypes.array,
};

export default HomePortfolio;
