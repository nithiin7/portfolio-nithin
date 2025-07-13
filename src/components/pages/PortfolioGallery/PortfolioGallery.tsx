'use client';
import Image from 'next/image';
import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import styles from './PortfolioGallery.module.scss';

interface GalleryImage {
	id: string;
	url: string;
	alt: string;
	caption?: string;
}

interface PortfolioGalleryProps {
	images: GalleryImage[];
	title?: string;
}

/**
 * `PortfolioGallery` component displays a grid of project images with lightbox functionality.
 *
 * @param {PortfolioGalleryProps} props - Component properties.
 * @param {GalleryImage[]} props.images - Array of gallery images.
 * @param {string} props.title - Optional gallery title.
 * @returns {JSX.Element} - Rendered PortfolioGallery component.
 */
const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
	images,
	title,
}) => {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const openLightbox = (index: number) => {
		setCurrentImageIndex(index);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
	};

	const goToPrevious = () => {
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const goToNext = () => {
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeLightbox();
		} else if (e.key === 'ArrowLeft') {
			goToPrevious();
		} else if (e.key === 'ArrowRight') {
			goToNext();
		}
	};

	if (!images || images.length === 0) {
		return null;
	}

	return (
		<>
			<div className={styles.PortfolioGallery}>
				{title && <h3 className={styles.PortfolioGallery__title}>{title}</h3>}
				<div className={styles.PortfolioGallery__gallery}>
					{images.map((image, index) => (
						<div
							key={image.id}
							className={styles.PortfolioGallery__galleryItem}
						>
							<button
								className={styles.PortfolioGallery__galleryImageContainer}
								onClick={() => openLightbox(index)}
							>
								<Image
									src={image.url}
									alt={image.alt}
									className={styles.PortfolioGallery__galleryImage}
									width={1000}
									height={1000}
								/>
								<div className={styles.PortfolioGallery__galleryOverlay}>
									<span className={styles.PortfolioGallery__galleryOverlayText}>
										Click to view
									</span>
								</div>
							</button>
							{image.caption && (
								<p className={styles.PortfolioGallery__galleryCaption}>
									{image.caption}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
			{lightboxOpen && (
				<div
					className={styles.PortfolioGallery__lightbox}
					onClick={closeLightbox}
					onKeyDown={handleKeyDown}
					tabIndex={0}
				>
					<div
						className={styles.PortfolioGallery__lightboxContent}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className={styles.PortfolioGallery__lightboxClose}
							onClick={closeLightbox}
						>
							<FiX size={24} />
						</button>

						<div className={styles.PortfolioGallery__lightboxMain}>
							<button
								className={styles.PortfolioGallery__lightboxNav}
								onClick={goToPrevious}
							>
								<FiChevronLeft size={24} />
							</button>

							<div className={styles.PortfolioGallery__lightboxImageContainer}>
								<Image
									src={images[currentImageIndex].url}
									alt={images[currentImageIndex].alt}
									className={styles.PortfolioGallery__lightboxImage}
									width={1000}
									height={1000}
								/>
								{images[currentImageIndex].caption && (
									<p className={styles.PortfolioGallery__lightboxCaption}>
										{images[currentImageIndex].caption}
									</p>
								)}
							</div>

							<button
								className={styles.PortfolioGallery__lightboxNav}
								onClick={goToNext}
							>
								<FiChevronRight size={24} />
							</button>
						</div>

						<div className={styles.PortfolioGallery__lightboxCounter}>
							{currentImageIndex + 1} / {images.length}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PortfolioGallery;
