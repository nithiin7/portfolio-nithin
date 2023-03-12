import styles from './PortfolioCard.module.scss';
import PropTypes from 'prop-types';

import ButtonPrimary from 'components/utilities/ButtonPrimary';

function PortfolioCard({ id, image, title, github, demo }) {
	return (
		<article
			data-aos="fade-up"
			data-aos-duration="1500"
			data-aos-once="true"
			key={id}
			className={styles['portfolio-card__item']}
		>
			<div className={styles['portfolio-card__image']}>
				<img src={image} alt={title}></img>
			</div>
			<h3>{title}</h3>
			<div className={styles['portfolio-card__cta']}>
				<ButtonPrimary href={github} classModifier={'button'} data={'Github'} />
				<ButtonPrimary
					href={demo}
					classModifier={'button'}
					data={'Live Demo'}
				/>
			</div>
		</article>
	);
}

PortfolioCard.propTypes = {
	id: PropTypes.number.isRequired,
	image: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	github: PropTypes.string.isRequired,
	demo: PropTypes.string.isRequired,
};

export default PortfolioCard;
