'use client';
import { motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

import { CareerCard } from 'components/pages';
import { MaskText } from 'components/utilities';
import type { Experience } from 'types/career';

import styles from './HomeCareer.module.scss';

interface HomeCareerProps {
	className?: string;
	data?: {
		title?: string;
		subtitle?: string;
	};
	experiences?: Experience[];
}

/**
 * HomeCareer component displays an interactive career timeline
 * with year-based navigation and detailed experience cards.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {Object} [data] - Data for the component, including title and subtitle.
 * @param {Experience[]} [experiences] - Array of career experiences.
 * @returns {JSX.Element} The rendered HomeCareer component.
 */
const HomeCareer: React.FC<HomeCareerProps> = ({
	className = '',
	data = {
		title: 'Career Journey',
		subtitle: 'Building digital experiences across different industries',
	},
	experiences = [],
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeYear, setActiveYear] = useState<string>(
		experiences.length > 0 ? experiences[0].year : ''
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!experiences.length) return;

			const currentIndex = experiences.findIndex(
				(exp) => exp.year === activeYear
			);

			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault();
					if (currentIndex < experiences.length - 1) {
						setActiveYear(experiences[currentIndex + 1].year);
					}
					break;
				case 'ArrowRight':
					event.preventDefault();
					if (currentIndex > 0) {
						setActiveYear(experiences[currentIndex - 1].year);
					}
					break;
				case 'Home':
					event.preventDefault();
					setActiveYear(experiences[experiences.length - 1].year);
					break;
				case 'End':
					event.preventDefault();
					setActiveYear(experiences[0].year);
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [activeYear, experiences]);

	const activeExperience = experiences.find((exp) => exp.year === activeYear);

	const yearButtonVariants = {
		inactive: { opacity: 0.6 },
		active: {
			opacity: 1,
			transition: { duration: 0.2 },
		},
		hover: { opacity: 0.85 },
	};

	if (!experiences || experiences.length === 0) {
		return null;
	}

	return (
		<motion.section
			id="career"
			ref={containerRef}
			className={`${styles.HomeCareer} ${className}`}
			style={{
				opacity: 1,
				scale: 1,
			}}
		>
			<div className={styles.HomeCareer__container}>
				<h2>
					<MaskText phrases={[data.title || 'Career Journey']} />
				</h2>
				{data.subtitle && <p>{data.subtitle}</p>}
				<div className={styles.HomeCareer__timeline}>
					<div
						className={styles.HomeCareer__years}
						role="tablist"
						aria-label="Career timeline navigation"
					>
						{experiences.map((experience) => (
							<motion.button
								key={experience.id}
								className={`${styles.CareerYearButton} ${
									activeYear === experience.year
										? styles['CareerYearButton--active']
										: ''
								}`}
								variants={yearButtonVariants}
								initial="inactive"
								animate={activeYear === experience.year ? 'active' : 'inactive'}
								onClick={() => setActiveYear(experience.year)}
								aria-label={`View career experience from ${experience.year}`}
								aria-pressed={activeYear === experience.year}
								role="tab"
								tabIndex={activeYear === experience.year ? 0 : -1}
								id={`career-${experience.year}`}
							>
								{experience.year}
							</motion.button>
						))}
					</div>
					{activeExperience && (
						<div className={styles.HomeCareer__card}>
							<CareerCard experience={activeExperience} />
						</div>
					)}
				</div>
			</div>
		</motion.section>
	);
};

export default HomeCareer;
