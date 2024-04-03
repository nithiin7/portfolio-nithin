import PropTypes from 'prop-types';
import styles from './HomeServices.module.scss';

import ServiceCard from 'components/pages/ServiceCard';

const HomeServices = (props) => {
	const { className, variant, data, services } = props;
	return (
		<div
			className={`${styles.HomeServices} ${
				styles[`HomeServices__${variant}`]
			} ${className}`}
		>
			<section id="services">
				<div className="services__header">
					<h2 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
						{data.title}
					</h2>
					<p data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
						{data.subTitle}
					</p>
				</div>
				<div data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">
					{services?.map((item, index) => {
						if (item.__typename == 'Section') {
							return (
								<ServiceCard
									key={index}
									i={index}
									heading={item.contentsCollection.items[0].title}
									list={item.contentsCollection.items[1].list}
								/>
							);
						}
					})}
				</div>
			</section>
		</div>
	);
};

HomeServices.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
	services: [],
};

HomeServices.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
	services: PropTypes.array,
};

export default HomeServices;
