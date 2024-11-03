import PropTypes from 'prop-types';
import styles from './HomeServices.module.scss';

import ServiceCard from 'components/pages/ServiceCard';
import MaskText from 'components/utilities/MaskText/MaskText';

const HomeServices = ({ className = '', data = {}, services = [] }) => {
	return (
		<div className={`${styles.HomeServices} ${className}`}>
			<section id="services">
				<div className="services__header">
					<h2>
						<MaskText phrases={[data.title]} />
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
									description={item.contentsCollection.items[0].subTitle}
								/>
							);
						}
					})}
				</div>
			</section>
		</div>
	);
};

HomeServices.propTypes = {
	className: PropTypes.string,
	data: PropTypes.object,
	services: PropTypes.array,
};

export default HomeServices;
