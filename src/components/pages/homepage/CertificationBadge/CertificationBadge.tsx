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
	return (
		<motion.button
			className={`${styles.CertificationBadge} ${
				certification.highlight ? styles['CertificationBadge--highlighted'] : ''
			}`}
			whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
			whileTap={{ scale: 0.97, transition: { duration: 0.15 } }}
			onClick={onClick}
			aria-label={`View details for ${certification.name}`}
		>
			<div className={styles.CertificationBadge__logo}>
				<Image
					src={certification.logo}
					alt={certification.name}
					width={48}
					height={48}
					unoptimized
				/>
			</div>
			<div className={styles.CertificationBadge__info}>
				<span className={styles.CertificationBadge__name}>
					{certification.name}
				</span>
				<span className={styles.CertificationBadge__provider}>
					{certification.provider}
				</span>
			</div>
		</motion.button>
	);
};

export default CertificationBadge;
