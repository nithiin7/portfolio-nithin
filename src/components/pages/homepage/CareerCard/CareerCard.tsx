'use client';
import { motion } from 'motion/react';

import type { Experience } from 'types/career';

import styles from './CareerCard.module.scss';

interface CareerCardProps {
	experience: Experience;
	className?: string;
}

const cardVariants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: [0.76, 0, 0.24, 1],
		},
	},
};

/**
 * CareerCard component displays detailed information about a career experience
 * including company, position, description, and technologies used.
 *
 * @component
 * @param {Experience} experience - The career experience data to display
 * @param {string} [className] - Additional CSS classes for styling
 * @returns {JSX.Element} The rendered CareerCard component
 */
const CareerCard: React.FC<CareerCardProps> = ({
	experience,
	className = '',
}) => {
	return (
		<motion.div
			className={`${styles.CareerCard} ${className}`}
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			key={experience.id}
			role="tabpanel"
			aria-labelledby={`career-${experience.year}`}
		>
			<div className={styles.CareerCard__content}>
				<div className={styles.CareerCard__header}>
					<div>
						<h3 className={styles.CareerCard__company}>{experience.company}</h3>
						<h4 className={styles.CareerCard__position}>
							{experience.position}
						</h4>
					</div>
					<div className={styles.CareerCard__meta}>
						<span>{experience.duration}</span>
						{experience.location && <span>{experience.location}</span>}
						<span className={styles.CareerCard__type}>{experience.type}</span>
					</div>
				</div>
				<ul className={styles.CareerCard__description}>
					{experience.description.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
				<div className={styles.CareerCard__technologies}>
					{experience.technologies.map((tech, index) => (
						<span
							key={`${tech}-${index}`}
							className={styles.CareerCard__techTag}
						>
							{tech}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
};

export default CareerCard;
