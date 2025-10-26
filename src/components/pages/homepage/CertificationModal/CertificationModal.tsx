'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import type { FC } from 'react';

import { Button } from 'components/utilities';
import type { Certification } from 'types/certification';

import styles from './CertificationModal.module.scss';

interface CertificationModalProps {
	certification: Certification;
}

/**
 * CertificationModal component displays detailed information
 * about a certification inside a modal.
 *
 * @component
 * @param {Certification} certification - The certification data to display.
 * @returns {JSX.Element} The rendered CertificationModal component.
 */
const CertificationModal: FC<CertificationModalProps> = ({ certification }) => {
	const contentVariants = {
		initial: {
			opacity: 0,
			y: 20,
		},
		animate: (custom: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: custom * 0.1,
				duration: 0.4,
				ease: [0.33, 1, 0.68, 1],
			},
		}),
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric',
		});
	};

	return (
		<div className={styles.CertificationModal}>
			<motion.div
				className={styles.CertificationModal__header}
				variants={contentVariants}
				initial="initial"
				animate="animate"
				custom={0}
			>
				<div className={styles.CertificationModal__logo}>
					<Image
						src={certification.logo}
						alt={certification.name}
						width={80}
						height={80}
						unoptimized
					/>
				</div>
				<div className={styles.CertificationModal__content}>
					<h3 className={styles.CertificationModal__name}>
						{certification.name}
					</h3>
					<p className={styles.CertificationModal__provider}>
						{certification.provider}
					</p>
				</div>
			</motion.div>

			<motion.div
				className={styles.CertificationModal__details}
				variants={contentVariants}
				initial="initial"
				animate="animate"
				custom={1}
			>
				<div className={styles.CertificationModal__detailItem}>
					<span className={styles.CertificationModal__label}>Issued:</span>
					<span className={styles.CertificationModal__value}>
						{formatDate(certification.issuedDate)}
					</span>
				</div>

				{certification.expiryDate && (
					<div className={styles.CertificationModal__detailItem}>
						<span className={styles.CertificationModal__label}>Expires:</span>
						<span className={styles.CertificationModal__value}>
							{formatDate(certification.expiryDate)}
						</span>
					</div>
				)}

				{certification.credentialId && (
					<div className={styles.CertificationModal__detailItem}>
						<span className={styles.CertificationModal__label}>
							Credential ID:
						</span>
						<span
							className={`${styles.CertificationModal__value} ${styles['CertificationModal__value--code']}`}
						>
							{certification.credentialId}
						</span>
					</div>
				)}
			</motion.div>

			{certification.description && (
				<motion.div
					className={styles.CertificationModal__description}
					variants={contentVariants}
					initial="initial"
					animate="animate"
					custom={2}
				>
					<p>{certification.description}</p>
				</motion.div>
			)}

			{certification.certificateUrl && (
				<motion.div
					className={styles.CertificationModal__actions}
					variants={contentVariants}
					initial="initial"
					animate="animate"
					custom={3}
				>
					<Button
						text="View Certificate"
						onClick={() => window.open(certification.certificateUrl, '_blank')}
						variant="primary"
					/>
				</motion.div>
			)}
		</div>
	);
};

export default CertificationModal;
