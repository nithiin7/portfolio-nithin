import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './PortfolioCard.module.scss';

const PortfolioCard = ({ image, title, demo, tech, year }) => {
	return (
		<Link href={demo} className={styles['portfolio-card__item']}>
			<div className={styles['portfolio-card__image']}>
				<Image
					src={image}
					alt={title}
					width={1000}
					height={1000}
					quality={100}
				/>
			</div>
			<div className={styles['portfolio-card__description']}>
				<h3>{title}</h3>
				<div className={styles['portfolio-card__items']}>
					<span className={styles['portfolio-card__techs']}>
						{tech.map((tech, index) => (
							<span key={index}>{tech}</span>
						))}
					</span>
					<span className={styles['portfolio-card__year']}>{year}</span>
				</div>
			</div>
		</Link>
	);
};

PortfolioCard.propTypes = {
	image: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	demo: PropTypes.string.isRequired,
	tech: PropTypes.array.isRequired,
	year: PropTypes.string.isRequired,
};

export default PortfolioCard;
