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

const WIDE_SIZES = '(min-width: 1280px) 66vw, (min-width: 1024px) 75vw, 100vw';
const HALF_SIZES =
	'(min-width: 1280px) 33vw, (min-width: 1024px) 37vw, (min-width: 768px) 50vw, 100vw';

interface PortfolioGalleryProps {
	images: GalleryImage[];
	projectTitle: string;
}

const pad = (n: number): string => String(n).padStart(2, '0');

const PortfolioGallery: FC<PortfolioGalleryProps> = ({
	images,
	projectTitle,
}): ReactElement | null => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [index, setIndex] = useState<number | null>(null);
	const lenis = useLenis();

	const active = index !== null ? images[index] : undefined;

	const altFor = (i: number): string =>
		images[i]?.alt ||
		`${projectTitle}, screenshot ${i + 1} of ${images.length}`;

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
				{index !== null && active && (
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
									src={active.url}
									alt={altFor(index)}
									fill
									sizes="100vw"
								/>
							</div>
							{active.alt && (
								<figcaption className={styles.PortfolioGallery__caption}>
									{active.alt}
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
