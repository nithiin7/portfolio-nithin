'use client';
import { useLenis } from 'lenis/react';
import Image from 'next/image';
import {
	useEffect,
	useRef,
	useState,
	type FC,
	type KeyboardEvent,
	type ReactElement,
} from 'react';

import RevealImage from 'components/motion/RevealImage/RevealImage';

import styles from './PortfolioGallery.module.scss';

export interface GalleryImage {
	id: string;
	url: string;
	alt: string;
}

// Body column is 9/12 of the grid from lg, 8/12 from xl; every third image spans it
const WIDE_SIZES = '(min-width: 1280px) 66vw, (min-width: 1024px) 75vw, 100vw';
const HALF_SIZES =
	'(min-width: 1280px) 33vw, (min-width: 1024px) 37vw, (min-width: 768px) 50vw, 100vw';

interface PortfolioGalleryProps {
	images: GalleryImage[];
	/** Used to describe images that have no Contentful description. */
	projectTitle: string;
}

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Two-up editorial grid (every third image spans the full width) with a
 * native <dialog> lightbox: focus trapping, Escape and the inert backdrop
 * come from the platform.
 */
const PortfolioGallery: FC<PortfolioGalleryProps> = ({
	images,
	projectTitle,
}): ReactElement | null => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [index, setIndex] = useState<number | null>(null);
	const lenis = useLenis();

	const altFor = (i: number): string =>
		images[i].alt || `${projectTitle}, screenshot ${i + 1} of ${images.length}`;

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (index !== null && !dialog.open) {
			dialog.showModal();
			lenis?.stop();
		}
	}, [index, lenis]);

	if (images.length === 0) return null;

	const close = (): void => {
		dialogRef.current?.close();
	};

	const step = (delta: number): void =>
		setIndex((i) =>
			i === null ? i : (i + delta + images.length) % images.length
		);

	const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>): void => {
		if (event.key === 'ArrowLeft') step(-1);
		if (event.key === 'ArrowRight') step(1);
	};

	return (
		<>
			<ul className={styles.PortfolioGallery}>
				{images.map((image, i) => (
					<li key={image.id} className={styles.PortfolioGallery__item}>
						<button
							type="button"
							className={styles.PortfolioGallery__open}
							onClick={() => setIndex(i)}
							aria-label={`Enlarge image ${i + 1} of ${images.length}: ${altFor(i)}`}
						>
							<RevealImage className={styles.PortfolioGallery__frame}>
								<Image
									src={image.url}
									alt=""
									fill
									sizes={i % 3 === 0 ? WIDE_SIZES : HALF_SIZES}
								/>
							</RevealImage>
						</button>
						{image.alt && (
							<p className={styles.PortfolioGallery__caption}>
								<span aria-hidden="true">{pad(i + 1)}</span> {image.alt}
							</p>
						)}
					</li>
				))}
			</ul>

			{/* Arrow keys page the lightbox; Escape is native to <dialog> */}
			<dialog
				ref={dialogRef}
				className={styles.PortfolioGallery__dialog}
				aria-label={`${projectTitle} gallery`}
				onKeyDown={onKeyDown}
				onClose={() => {
					setIndex(null);
					lenis?.start();
				}}
			>
				{index !== null && (
					<>
						<div className={styles.PortfolioGallery__dialogBar}>
							<span
								className={styles.PortfolioGallery__counter}
								aria-live="polite"
							>
								{pad(index + 1)}/{pad(images.length)}
							</span>
							<button
								type="button"
								className={styles.PortfolioGallery__control}
								onClick={close}
							>
								Close
							</button>
						</div>
						<figure className={styles.PortfolioGallery__figure}>
							<div className={styles.PortfolioGallery__stage}>
								<Image
									src={images[index].url}
									alt={altFor(index)}
									fill
									sizes="100vw"
								/>
							</div>
							{images[index].alt && (
								<figcaption className={styles.PortfolioGallery__caption}>
									{images[index].alt}
								</figcaption>
							)}
						</figure>
						{images.length > 1 && (
							<div className={styles.PortfolioGallery__dialogBar}>
								<button
									type="button"
									className={styles.PortfolioGallery__control}
									onClick={() => step(-1)}
								>
									← Previous
								</button>
								<button
									type="button"
									className={styles.PortfolioGallery__control}
									onClick={() => step(1)}
								>
									Next →
								</button>
							</div>
						)}
					</>
				)}
			</dialog>
		</>
	);
};

export default PortfolioGallery;
