'use client';
import Image from 'next/image';
import type { FC, ReactElement } from 'react';
import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';
import type { PortfolioItem } from 'types/portfolio';

import styles from './WorksMedia.module.scss';

interface WorksMediaProps {
	project: PortfolioItem;
	sizes: string;
	/** Preloads the image; reserve for the single above-the-fold candidate. */
	priority?: boolean;
	/** Plays the cover video when one exists. */
	playing?: boolean;
	className?: string;
}

const WorksMedia: FC<WorksMediaProps> = ({
	project,
	sizes,
	priority = false,
	playing = false,
	className,
}): ReactElement => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const reducedMotion = usePrefersReducedMotion();
	const video = project.coverVideo?.url ? project.coverVideo : null;
	const shouldPlay = playing && !reducedMotion;

	useEffect(() => {
		const el = videoRef.current;
		if (!el) return;
		if (shouldPlay) {
			// play() rejects when interrupted by a pause; that is expected here
			el.play().catch(() => undefined);
		} else {
			el.pause();
		}
	}, [shouldPlay]);

	return (
		<div className={[styles.WorksMedia, className].filter(Boolean).join(' ')}>
			{project.image?.url && (
				<Image
					src={project.image.url}
					alt=""
					fill
					sizes={sizes}
					priority={priority}
					placeholder={project.blurDataURL ? 'blur' : 'empty'}
					blurDataURL={project.blurDataURL}
					className={styles.WorksMedia__image}
				/>
			)}
			{video && !reducedMotion && (
				<video
					ref={videoRef}
					className={styles.WorksMedia__video}
					data-playing={shouldPlay}
					src={video.url}
					muted
					loop
					playsInline
					preload="none"
					aria-hidden="true"
				/>
			)}
		</div>
	);
};

export default WorksMedia;
