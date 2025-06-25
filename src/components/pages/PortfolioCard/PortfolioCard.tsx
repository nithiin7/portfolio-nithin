import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import styles from './PortfolioCard.module.scss';

interface PortfolioCardProps {
	image: string;
	title: string;
	demo: string;
	tech: string[];
	year?: string;
}

/**
 * `PortfolioCard` component displays a single portfolio item,
 * including an image, title, technologies used, and optional year.
 *
 * @param {PortfolioCardProps} props - Component properties.
 * @param {string} props.image - URL of the portfolio item image.
 * @param {string} props.title - Title of the portfolio item.
 * @param {string} props.demo - Link to the live demo of the portfolio item.
 * @param {string[]} props.tech - Array of technologies used in the portfolio item.
 * @param {string} [props.year] - Year of the portfolio item (optional).
 * @returns {JSX.Element} - Rendered PortfolioCard component.
 */
const PortfolioCard: FC<PortfolioCardProps> = ({
	image,
	title,
	demo,
	tech,
	year,
}) => {
	return (
		<Link href={demo} className={styles['portfolio-card__item']} title={title}>
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
							<span key={`${techItem}-${index}`}>{techItem}</span>
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
