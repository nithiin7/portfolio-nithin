'use client';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type FC } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

import CertificationBadge from 'components/pages/homepage/CertificationBadge/CertificationBadge';
import { MaskText, Modal } from 'components/utilities';
import type { Certification } from 'types/certification';

import styles from './HomeCertifications.module.scss';

const CertificationModal = dynamic(
	() =>
		import('components/pages/homepage/CertificationModal/CertificationModal')
);

const MARQUEE_QUERY =
	'(min-width: 768px) and (prefers-reduced-motion: no-preference)';

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
	const [isMarquee, setIsMarquee] = useState(false);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const trackRef = useRef<HTMLDivElement>(null);
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

	const certificationsToRender = isMarquee
		? duplicatedCertifications
		: certifications;

	const handleBadgeClick = (certification: Certification) => {
		setSelectedCertification(certification);
	};

	const handleCloseModal = () => {
		setSelectedCertification(null);
	};

	useEffect(() => {
		const mql = window.matchMedia(MARQUEE_QUERY);
		setIsMarquee(mql.matches);

		const handleChange = (event: MediaQueryListEvent) => {
			setIsMarquee(event.matches);
		};

		mql.addEventListener('change', handleChange);
		return () => mql.removeEventListener('change', handleChange);
	}, []);

	useEffect(() => {
		const track = trackRef.current;
		if (!track || isMarquee) {
			setCanScrollLeft(false);
			setCanScrollRight(false);
			return;
		}

		const updateScrollState = () => {
			setCanScrollLeft(track.scrollLeft > 4);
			setCanScrollRight(
				track.scrollLeft + track.clientWidth < track.scrollWidth - 4
			);
		};

		updateScrollState();
		track.addEventListener('scroll', updateScrollState, { passive: true });

		const resizeObserver = new ResizeObserver(updateScrollState);
		resizeObserver.observe(track);

		return () => {
			track.removeEventListener('scroll', updateScrollState);
			resizeObserver.disconnect();
		};
	}, [isMarquee, certifications.length]);

	const scrollByDirection = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollBy({
			left: direction * track.clientWidth * 0.85,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		if (!carouselRef.current || !inView || !isMarquee) return;

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
	}, [inView, isMarquee]);

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
							<MaskText
								className={styles.HomeCertifications__titleFull}
								phrases={[data.title || 'Certifications.']}
							/>
							<MaskText
								className={styles.HomeCertifications__titleShort}
								phrases={['Certs.']}
							/>
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

					<div className={styles.HomeCertifications__trackWrapper}>
						<div className={styles.HomeCertifications__track} ref={trackRef}>
							<div
								className={styles.HomeCertifications__carousel}
								ref={carouselRef}
								role="presentation"
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
								style={{
									display: 'flex',
									width: isMarquee ? '300%' : undefined,
								}}
							>
								{certificationsToRender.map((certification, index) => (
									<CertificationBadge
										key={`${certification.id}-${index}`}
										certification={certification}
										onClick={() => handleBadgeClick(certification)}
									/>
								))}
							</div>
						</div>
						{!isMarquee && (
							<>
								<button
									type="button"
									className={styles.HomeCertifications__arrow}
									onClick={() => scrollByDirection(-1)}
									disabled={!canScrollLeft}
									aria-label="Scroll to previous certifications"
								>
									<FiChevronLeft size={18} />
								</button>
								<button
									type="button"
									className={`${styles.HomeCertifications__arrow} ${styles['HomeCertifications__arrow--next']}`}
									onClick={() => scrollByDirection(1)}
									disabled={!canScrollRight}
									aria-label="Scroll to more certifications"
								>
									<FiChevronRight size={18} />
								</button>
							</>
						)}
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
