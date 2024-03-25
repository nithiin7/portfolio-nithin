import PropTypes from 'prop-types';
import styles from './HomeExperience.module.scss';

import ExperienceCard from 'components/pages/ExperienceCard';

const HomeExperience = (props) => {
	const { className, variant, data } = props;
	return (
		<div
			className={`${styles.HomeExperience} ${
				styles[`HomeExperience__${variant}`]
			} ${className}`}
		>
			<section id="experience">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{data.items[0].title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{data.items[0].subTitle}
				</h2>
				<div className="portfolio__experience">
					<div
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={'experience__frontend'}
					>
						<h3
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
						>
							{data.items[1].title}
						</h3>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={'experience__content'}
						>
							{data.items[1].contentsCollection.items?.map((item) => (
								<ExperienceCard
									key={item.title}
									tech={item.title}
									experience={item.description}
								/>
							))}
						</div>
					</div>
					<div className={'experience__backend'}>
						<h3
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
						>
							{data.items[2].title}
						</h3>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={'experience__content'}
						>
							{data.items[2].contentsCollection.items?.map((item) => (
								<ExperienceCard
									key={item.title}
									tech={item.title}
									experience={item.description}
								/>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

HomeExperience.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
};

HomeExperience.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
};

export default HomeExperience;
