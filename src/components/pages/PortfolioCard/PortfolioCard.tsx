import Image from 'next/image';
import Link from 'next/link';
import styles from './PortfolioCard.module.scss';

interface PortfolioCardProps {
	image: string;
	title: string;
	demo: string;
	tech: string[];
	year?: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
	image,
	title,
	demo,
	tech,
	year,
}) => {
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
						{tech.map((techItem, index) => (
							<span key={index}>{techItem}</span>
						))}
					</span>
					{year && (
						<span className={styles['portfolio-card__year']}>{year}</span>
					)}
				</div>
			</div>
		</Link>
	);
};

export default PortfolioCard;
