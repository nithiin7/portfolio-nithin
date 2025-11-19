'use client';
import gsap from 'gsap';
import { useEffect, useRef, useState, type FC } from 'react';
import { useInView } from 'react-intersection-observer';

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
	const [selectedCertification, setSelectedCertification] =
		useState<Certification | null>(null);
	const carouselRef = useRef<HTMLDivElement>(null);
	const tweenRef = useRef<gsap.core.Tween | null>(null);
	const { ref: inViewRef, inView } = useInView({
		threshold: 0.3,
		triggerOnce: true,
	});

	const setRefs = (node: HTMLElement | null) => {
		inViewRef(node);
	};

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

	useEffect(() => {
		if (!carouselRef.current || !inView) return;

		const totalWidthPercent = 100 / 3;

		const ctx = gsap.context(() => {
			tweenRef.current = gsap.to(carouselRef.current, {
				xPercent: -totalWidthPercent,
				ease: 'none',
				duration: 30,
				repeat: -1,
			});
		});

		return () => ctx.revert();
	}, [inView]);

	useEffect(() => {
		if (!tweenRef.current) return;

		if (selectedCertification) {
			tweenRef.current.pause();
		} else {
			tweenRef.current.play();
		}
	}, [selectedCertification]);

	const handleMouseEnter = () => {
		tweenRef.current?.pause();
	};

	const handleMouseLeave = () => {
		if (!selectedCertification) {
			tweenRef.current?.play();
		}
	};

	if (!certifications || certifications.length === 0) {
		return null;
	}

	return (
		<>
			<section
				id="certifications"
				ref={setRefs}
				className={`${styles.HomeCertifications} ${className}`}
			>
				<div className={styles.HomeCertifications__container}>
					<div className={styles.HomeCertifications__header}>
						<h2>
							<MaskText phrases={[data.title || 'Certifications']} />
						</h2>
						{data.subtitle && <p>{data.subtitle}</p>}
						<a
							className={styles.HomeCertifications__headerLink}
							href="https://www.credly.com/users/nithin-pradeep.53925824"
							target="_blank"
							rel="noopener noreferrer"
						>
							View badges on Credly →
						</a>
					</div>

					<div className={styles.HomeCertifications__track}>
						<div
							className={styles.HomeCertifications__carousel}
							ref={carouselRef}
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
							style={{ display: 'flex', width: '300%' }}
						>
							{duplicatedCertifications.map((certification, index) => (
								<CertificationBadge
									key={`${certification.id}-${index}`}
									certification={certification}
									onClick={() => handleBadgeClick(certification)}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

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
