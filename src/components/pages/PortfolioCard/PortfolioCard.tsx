import Link from 'next/link';
import type { FC } from 'react';

import styles from './PortfolioCard.module.scss';

interface PortfolioCardProps {
	project: {
		title: string;
		demo?: string;
		tech?: string[];
		year?: string;
		image?: {
			url: string;
		};
	};
	index: number;
	title: string;
	setModal: (modal: { active: boolean; index: number }) => void;
}

/**
 * `PortfolioCard` component displays a single portfolio item with hover animations
 * and mouse-following functionality.
 *
 * @param {PortfolioCardProps} props - Component properties.
 * @param {object} props.project - Portfolio project data.
 * @param {number} props.index - Index of the portfolio item.
 * @param {function} props.setModal - Function to set the modal state.
 * @returns {JSX.Element} - Rendered PortfolioCard component.
 */
const PortfolioCard: FC<PortfolioCardProps> = ({
	index,
	project,
	setModal,
}) => {
	return (
		<Link
			href={project.demo ?? '#'}
			className={styles.PortfolioCard__item}
			onMouseEnter={() => {
				setModal({ active: true, index });
			}}
			onMouseLeave={() => {
				setModal({ active: false, index });
			}}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className={styles.PortfolioCard__item_content}>
				<div className={styles.PortfolioCard__item_left}>
					<div className={styles.PortfolioCard__item_number}>
						{String(index + 1).padStart(2, '0')}
					</div>
					<div className={styles.PortfolioCard__item_info}>
						<h3 className={styles.PortfolioCard__item_title}>
							{project.title}
						</h3>
						{project.year && (
							<p className={styles.PortfolioCard__item_year}>{project.year}</p>
						)}
					</div>
				</div>
				<div className={styles.PortfolioCard__item_right}>
					<div className={styles.PortfolioCard__item_tech}>
						{project.tech?.map((tech, techIndex) => (
							<span
								key={`${tech}-${techIndex}`}
								className={styles.PortfolioCard__item_tech_tag}
							>
								{tech}
							</span>
						))}
					</div>
				</div>
			</div>
			<div className={styles.PortfolioCard__item_line}></div>
		</Link>
	);
};

export default PortfolioCard;
