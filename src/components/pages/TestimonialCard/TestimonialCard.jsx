import PropTypes from 'prop-types';

import Testimonial from 'assets/images/testimonial.svg';
import styles from './TestimonialCard.module.scss';
import Image from 'next/image';

const TestimonialCard = (props) => {
	const { className, variant, item } = props;
	return (
		<div
			className={`${styles.TestimonialCard} ${
				styles[`TestimonialCard__${variant}`]
			} ${className}`}
		>
			<Testimonial />
			<blockquote>{item.review}</blockquote>
			<div className="TestimonialCard__reviewer">
				<div className="TestimonialCard__img">
					<Image
						src={item.avatar.url}
						alt="Avatar"
						width={1000}
						height={1000}
						priority
						quality={100}
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

TestimonialCard.defaultProps = {
	variant: 'default',
	className: '',
	item: {},
};

TestimonialCard.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	item: PropTypes.object,
};

export default TestimonialCard;
