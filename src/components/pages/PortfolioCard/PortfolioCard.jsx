import styles from './PortfolioCard.module.scss';
import ButtonPrimary from 'components/utilities/ButtonPrimary';

function PortfolioCard({ id, image, title, github, demo }) {
	return (
		<article
			data-aos="fade-up"
			data-aos-duration="1500"
			data-aos-once="true"
			key={id}
			className={styles['portfolio__item']}
		>
			<div className={styles['portfolio__item-image']}>
				<img src={image} alt={title}></img>
			</div>
			<h3>{title}</h3>
			<div className={styles['portfolio__item-cta']}>
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

export default PortfolioCard;
