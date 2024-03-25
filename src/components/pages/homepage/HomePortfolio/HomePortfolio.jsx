'use client';
import PropTypes from 'prop-types';
import styles from './HomePortfolio.module.scss';

import PortfolioCard from 'components/pages/PortfolioCard';

const HomePortfolio = (props) => {
	const { className, variant, data, portfolio } = props;
	return (
		<div
			className={`${styles.HomePortfolio} ${
				styles[`HomePortfolio__${variant}`]
			} ${className}`}
		>
			<section id="portfolio">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{data.title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{data.subTitle}
				</h2>
				<div className="portfolio__portfolio">
					{portfolio.map((item, index) => {
						return (
							<PortfolioCard
								key={index}
								id={item.id}
								image={item.image.url}
								title={item.title}
								github={item.gitHub}
								demo={item.demo}
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
	portfolio: PropTypes.object,
};

export default HomePortfolio;
