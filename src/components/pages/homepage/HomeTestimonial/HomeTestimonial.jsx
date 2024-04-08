'use client';
import PropTypes from 'prop-types';

import styles from './HomeTestimonial.module.scss';
import TestimonialCard from 'components/pages/TestimonialCard/TestimonialCard';
import MaskText from 'components/utils/MaskText/MaskText';

const HomeTestimonial = (props) => {
	const { className, variant, data, testimonial } = props;
	return (
		<div
			className={`${styles.HomeTestimonial} ${
				styles[`HomeTestimonial__${variant}`]
			} ${className}`}
		>
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

HomeTestimonial.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
	testimonial: {},
};

HomeTestimonial.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
	testimonial: PropTypes.array,
};

export default HomeTestimonial;
