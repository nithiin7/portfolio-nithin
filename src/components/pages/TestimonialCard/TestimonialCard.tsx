import { FC } from 'react';
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
const TestimonialCard: FC<TestimonialCardProps> = ({
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
			className={[
				styles.TestimonialCard,
				styles[`TestimonialCard__${variant}`],
				className,
			].join(' ')}
		>
			<Testimonial />
			<blockquote>{item.review}</blockquote>
			<div className={styles.TestimonialCard__reviewer}>
				<div className={styles.TestimonialCard__img}>
					<Image
						src={item.avatar.url}
						alt="Avatar"
						width={60}
						height={60}
						quality={90}
					/>
				</div>
				<div className={styles.TestimonialCard__info}>
					<span className={styles.Info__name}>{item.reviewer}</span>
					<span className={styles.Info__institution}>{item.institution}</span>
				</div>
			</div>
		</div>
	);
};

export default TestimonialCard;
