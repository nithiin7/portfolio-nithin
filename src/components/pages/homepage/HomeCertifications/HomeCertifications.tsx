'use client';
import { motion, type Variants } from 'motion/react';
import dynamic from 'next/dynamic';
import {
	useState,
	type CSSProperties,
	type FC,
	type ReactElement,
} from 'react';

import { RevealText, duration, ease } from 'components/motion';
import Modal from 'components/utilities/Modal/Modal';
import { siteConfig } from 'config/site';
import type { Certification } from 'types/certification';

import styles from './HomeCertifications.module.scss';

const CertificationModal = dynamic(
	() =>
		import('components/pages/homepage/CertificationModal/CertificationModal')
);

interface HomeCertificationsProps {
	className?: string;
	data?: {
		title?: string;
		subtitle?: string;
	};
	certifications?: Certification[];
}

const strip: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.04 } },
};

const tile: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: duration.fast, ease } },
};

const HomeCertifications: FC<HomeCertificationsProps> = ({
	className = '',
	data,
	certifications = [],
}): ReactElement | null => {
	const [selected, setSelected] = useState<Certification | null>(null);
	const [hovered, setHovered] = useState<Certification | null>(null);

	if (certifications.length === 0) return null;

	const caption = hovered ?? certifications.find((c) => c.highlight);

	return (
		<>
			<section
				id="certifications"
				className={`${styles.HomeCertifications} ${className}`}
			>
				<div className={styles.HomeCertifications__inner}>
					<header className={styles.HomeCertifications__head}>
						<p className={styles.HomeCertifications__label}>Certifications</p>
						<h2 className={styles.HomeCertifications__count}>
							<span className={styles.HomeCertifications__number}>
								{String(certifications.length).padStart(2, '0')}
							</span>{' '}
							<RevealText
								as="span"
								className={styles.HomeCertifications__title}
							>
								{data?.title || 'Certifications.'}
							</RevealText>
						</h2>
						<div className={styles.HomeCertifications__aside}>
							{data?.subtitle && (
								<p className={styles.HomeCertifications__lede}>
									{data.subtitle}
								</p>
							)}
							<a
								className={styles.HomeCertifications__link}
								href={siteConfig.socials.credly}
								target="_blank"
								rel="noopener noreferrer"
							>
								Verify on Credly
								<span aria-hidden="true"> ↗</span>
								<span className={styles.HomeCertifications__srOnly}>
									(opens in a new tab)
								</span>
							</a>
						</div>
					</header>

					<motion.ul
						className={styles.HomeCertifications__strip}
						variants={strip}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						onMouseLeave={() => setHovered(null)}
					>
						{certifications.map((certification) => (
							<motion.li
								key={certification.id ?? certification.name}
								variants={tile}
							>
								<button
									type="button"
									className={`${styles.HomeCertifications__badge} ${
										certification.highlight
											? styles['HomeCertifications__badge--highlight']
											: ''
									}`}
									aria-label={`${certification.name}, ${certification.provider}. View details`}
									aria-haspopup="dialog"
									onClick={() => setSelected(certification)}
									onMouseEnter={() => setHovered(certification)}
									onFocus={() => setHovered(certification)}
									onBlur={() => setHovered(null)}
								>
									<span
										className={styles.HomeCertifications__logo}
										style={
											{
												'--logo': `url("${certification.logo}")`,
											} as CSSProperties
										}
									/>
								</button>
							</motion.li>
						))}
					</motion.ul>

					<p className={styles.HomeCertifications__caption} aria-hidden="true">
						{caption ? (
							<>
								<span className={styles.HomeCertifications__provider}>
									{caption.provider}
								</span>
								<span>{caption.name}</span>
							</>
						) : (
							<span className={styles.HomeCertifications__provider}>
								Select a badge for details
							</span>
						)}
					</p>
				</div>
			</section>

			<Modal
				isOpen={!!selected}
				onClose={() => setSelected(null)}
				title="Certification Details"
			>
				{selected && <CertificationModal certification={selected} />}
			</Modal>
		</>
	);
};

export default HomeCertifications;
