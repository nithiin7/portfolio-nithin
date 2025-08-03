'use client';

import type { FC } from 'react';

import { TestimonialCard } from 'components/pages';
import MaskText from 'components/utilities/MaskText/MaskText';
import type { Testimonial } from 'types/testimony';

import styles from './HomeTestimonial.module.scss';

interface HomeTestimonialProps {
	className?: string;
	data?: {
		title?: string;
	};
	testimonial?: Testimonial[];
}

/**
 * `HomeTestimonial` component displays a section of user testimonials,
 * including a header and a list of testimonial cards.
 *
 * @param {HomeTestimonialProps} props - Component properties.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {Object} [props.data] - Data object containing header information.
 * @param {string} [props.data.title] - Title of the testimonials section.
 * @param {Testimonial[]} [props.testimonial] - Array of testimonial items to display.
 * @returns {JSX.Element} - Rendered HomeTestimonial component.
 */
const HomeTestimonial: FC<HomeTestimonialProps> = ({
	className = '',
	data = { title: '' },
	testimonial = [],
}) => {
	return (
		<div className={`${styles.HomeTestimonial} ${className}`}>
			<section id="testimonials">
				<h2>
					<MaskText phrases={[data.title ?? '']} />
				</h2>
				<div className={styles.HomeTestimonial__testimonial}>
					{testimonial.map((item, index) => {
						return <TestimonialCard key={`${item.id}-${index}`} item={item} />;
					})}
				</div>
			</section>
		</div>
	);
};

export default HomeTestimonial;
