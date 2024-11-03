'use client';
import { Testimonial } from 'types/testimony';
import styles from './HomeTestimonial.module.scss';

import TestimonialCard from 'components/pages/TestimonialCard/TestimonialCard';
import MaskText from 'components/utilities/MaskText/MaskText';

interface HomeTestimonialProps {
	className?: string;
	data?: {
		title?: string;
	};
	testimonial?: Testimonial[];
}

const HomeTestimonial: React.FC<HomeTestimonialProps> = ({
	className = '',
	data = { title: '' },
	testimonial = [],
}) => {
	return (
		<div className={`${styles.HomeTestimonial} ${className}`}>
			<section id="testimonials">
				<h2>
					<MaskText phrases={[data.title || '']} />
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

export default HomeTestimonial;
