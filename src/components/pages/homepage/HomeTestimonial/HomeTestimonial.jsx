'use client';
import PropTypes from 'prop-types';

import styles from './HomeTestimonial.module.scss';
import TestimonialCard from 'components/pages/TestimonialCard/TestimonialCard';
import MaskText from 'components/utilities/MaskText/MaskText';

const HomeTestimonial = ({ className = '', data = {}, testimonial = {} }) => {
	return (
		<div className={`${styles.HomeTestimonial} ${className}`}>
			<section id="testimonials">
				<h2>
					<MaskText phrases={[data.title]} />
				</h2>
				<div className="HomeTestimonial__testimonial">
					{testimonial.map((item, index) => {
						return <TestimonialCard key={index} item={item} />;
					})}
				</div>
			</section>
		</div>
	);
};

HomeTestimonial.propTypes = {
	className: PropTypes.string,
	data: PropTypes.object,
	testimonial: PropTypes.array,
};

export default HomeTestimonial;
