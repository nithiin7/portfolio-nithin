'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import type { FC } from 'react';

import type { Certification } from 'types/certification';

import styles from './CertificationBadge.module.scss';

interface CertificationBadgeProps {
	certification: Certification;
	onClick: () => void;
}

/**
 * CertificationBadge component displays an individual certification badge
 * with logo and name in a circular design.
 *
 * @component
 * @param {Certification} certification - The certification data to display.
 * @param {Function} onClick - Callback when badge is clicked.
 * @returns {JSX.Element} The rendered CertificationBadge component.
 */
const CertificationBadge: FC<CertificationBadgeProps> = ({
	certification,
	onClick,
}) => {
	const badgeVariants = {
		initial: {
			scale: 1,
		},
		hover: {
			scale: 1.1,
			rotate: 5,
			transition: {
				duration: 0.3,
				ease: [0.76, 0, 0.24, 1],
			},
		},
		tap: {
			scale: 0.95,
			transition: {
				duration: 0.15,
				ease: [0.76, 0, 0.24, 1],
			},
		},
	};

	const logoVariants = {
		initial: {
			scale: 1,
		},
		hover: {
			scale: 1.15,
			rotate: -5,
			transition: {
				duration: 0.3,
				ease: [0.76, 0, 0.24, 1],
			},
		},
	};

	return (
		<motion.button
			className={`${styles.CertificationBadge} ${
				certification.highlight ? styles.CertificationBadge_highlighted : ''
			}`}
			variants={badgeVariants}
			initial="initial"
			whileHover="hover"
			whileTap="tap"
			onClick={onClick}
			aria-label={`View details for ${certification.name}`}
		>
			<motion.div
				className={`${styles.CertificationBadge__circle} ${
					certification.highlight
						? styles.CertificationBadge__circle_highlighted
						: ''
				}`}
			>
				<motion.div
					className={styles.CertificationBadge__logo}
					variants={logoVariants}
				>
					<Image
						src={certification.logo}
						alt={certification.name}
						width={80}
						height={80}
						unoptimized
					/>
				</motion.div>
				<div className={styles.CertificationBadge__ring}>
					<svg viewBox="0 0 200 200">
						<defs>
							<path
								id={`circlePath-${certification.id}`}
								d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
							/>
						</defs>
						<text className={styles.CertificationBadge__text}>
							<textPath
								href={`#circlePath-${certification.id}`}
								startOffset="0%"
							>
								• {certification.name} •
							</textPath>
						</text>
					</svg>
				</div>
			</motion.div>
		</motion.button>
	);
};

export default CertificationBadge;
