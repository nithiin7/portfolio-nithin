import React from 'react';
import Image from 'next/image';
import { Testimonial as TestimonialType } from 'types/testimony';

import Testimonial from 'assets/images/testimonial.svg';
import styles from './TestimonialCard.module.scss';

interface TestimonialCardProps {
	className?: string;
	variant?: string;
	item?: TestimonialType;
}

/**
 * A component that displays a testimonial with a review, reviewer information, and an avatar.
 * @param {TestimonialCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered testimonial card component.
 */
const TestimonialCard: React.FC<TestimonialCardProps> = ({
	className = '',
	variant = '',
	item = {
		review: 'No review provided.',
		avatar: { url: '' },
		reviewer: 'Anonymous',
		institution: 'Unknown Institution',
	},
}) => {
	return (
		<div
			className={`${styles.TestimonialCard} ${styles[`TestimonialCard__${variant}`]} ${className}`}
		>
			<Testimonial />
			<blockquote>{item.review}</blockquote>
			<div className="TestimonialCard__reviewer">
				<div className="TestimonialCard__img">
					<Image
						src={item.avatar.url}
						alt="Avatar"
						width={60}
						height={60}
						quality={90}
					/>
				</div>
				<div className="TestimonialCard__info">
					<span className="Info__name">{item.reviewer}</span>
					<span className="Info__institution">{item.institution}</span>
				</div>
			</div>
		</div>
	);
};

export default TestimonialCard;
