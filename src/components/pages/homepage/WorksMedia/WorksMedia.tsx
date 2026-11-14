'use client';
import type { FC, ReactElement } from 'react';
import { useEffect, useRef } from 'react';

import ThemedImage from 'components/utilities/ThemedImage/ThemedImage';
import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';
import type { PortfolioItem } from 'types/portfolio';

import styles from './WorksMedia.module.scss';

interface WorksMediaProps {
	project: PortfolioItem;
	sizes: string;
	playing?: boolean;
	className?: string;
}

const WorksMedia: FC<WorksMediaProps> = ({
	project,
	sizes,
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
			el.play().catch(() => undefined);
		} else {
			el.pause();
		}
	}, [shouldPlay]);

	return (
		<div className={[styles.WorksMedia, className].filter(Boolean).join(' ')}>
			{project.image?.url && (
				<ThemedImage
					src={project.image.url}
					srcDark={project.imageDark?.url}
					alt=""
					fill
					sizes={sizes}
					blurDataURL={project.blurDataURL}
					blurDataURLDark={project.blurDataURLDark}
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
