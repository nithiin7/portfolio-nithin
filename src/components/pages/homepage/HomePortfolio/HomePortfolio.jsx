'use client';
import PropTypes from 'prop-types';
import styles from './HomePortfolio.module.scss';

import PortfolioCard from 'components/pages/PortfolioCard';
import MaskText from 'components/utilities/MaskText/MaskText';

const HomePortfolio = (props) => {
	const { className, variant, data, portfolio } = props;
	return (
		<div
			className={`${styles.HomePortfolio} ${
				styles[`HomePortfolio__${variant}`]
			} ${className}`}
		>
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

HomePortfolio.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
	portfolio: {},
};

HomePortfolio.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
	portfolio: PropTypes.array,
};

export default HomePortfolio;
