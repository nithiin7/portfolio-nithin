'use client';
import { motion } from 'motion/react';
import { useRef, useState, type FC } from 'react';

import CertificationBadge from 'components/pages/homepage/CertificationBadge/CertificationBadge';
import CertificationModal from 'components/pages/homepage/CertificationModal/CertificationModal';
import { MaskText, Modal } from 'components/utilities';
import type { Certification } from 'types/certification';

import styles from './HomeCertifications.module.scss';

interface HomeCertificationsProps {
	className?: string;
	data?: {
		title?: string;
		subtitle?: string;
	};
	certifications?: Certification[];
}

/**
 * HomeCertifications component displays an infinite auto-scrolling carousel
 * of certification badges with modal details on click.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {Object} [data] - Data for the component, including title and subtitle.
 * @param {Certification[]} [certifications] - Array of certifications to display.
 * @returns {JSX.Element} The rendered HomeCertifications component.
 */
const HomeCertifications: FC<HomeCertificationsProps> = ({
	className = '',
	data = {
		title: 'Certifications',
		subtitle: 'Professional certifications and achievements',
	},
	certifications = [],
}) => {
	const ref = useRef(null);
	const [selectedCertification, setSelectedCertification] =
		useState<Certification | null>(null);

	// Duplicate certifications for seamless infinite scroll
	const duplicatedCertifications = [
		...certifications,
		...certifications,
		...certifications,
	];

	const handleBadgeClick = (certification: Certification) => {
		setSelectedCertification(certification);
	};

	const handleCloseModal = () => {
		setSelectedCertification(null);
	};

	if (!certifications || certifications.length === 0) {
		return null;
	}

	return (
		<>
			<motion.section
				id="certifications"
				ref={ref}
				className={`${styles.HomeCertifications} ${className}`}
			>
				<div className={styles.HomeCertifications__container}>
					<div className={styles.HomeCertifications__header}>
						<h2>
							<MaskText phrases={[data.title || 'Certifications']} />
						</h2>
						{data.subtitle && <p>{data.subtitle}</p>}
					</div>

					<div className={styles.HomeCertifications__track}>
						<motion.div
							className={styles.HomeCertifications__carousel}
							animate={{
								x: [0, -100 / 3 + '%'],
							}}
							transition={{
								x: {
									repeat: Infinity,
									repeatType: 'loop',
									duration: 30,
									ease: 'linear',
								},
							}}
						>
							{duplicatedCertifications.map((certification, index) => (
								<CertificationBadge
									key={`${certification.id}-${index}`}
									certification={certification}
									onClick={() => handleBadgeClick(certification)}
								/>
							))}
						</motion.div>
					</div>
				</div>
			</motion.section>

			<Modal
				isOpen={!!selectedCertification}
				onClose={handleCloseModal}
				title="Certification Details"
			>
				{selectedCertification && (
					<CertificationModal certification={selectedCertification} />
				)}
			</Modal>
		</>
	);
};

export default HomeCertifications;
