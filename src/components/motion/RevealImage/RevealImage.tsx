'use client';

import type { CSSProperties, FC, ReactElement, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

import { useRevealOnMount } from 'components/motion/useRevealOnMount';

import styles from './RevealImage.module.scss';

export interface RevealImageProps {
	children: ReactNode;
	/** Size the frame here (aspect-ratio / width); the media fills it. */
	className?: string;
	/** Seconds before the reveal starts. */
	delay?: number;
	trigger?: 'inView' | 'mount';
	once?: boolean;
	amount?: number;
}

/**
 * Clip-path reveal (bottom → top) with the media settling from 1.15 → 1
 * scale. Under prefers-reduced-motion the media is shown immediately.
 */
const RevealImage: FC<RevealImageProps> = ({
	children,
	className,
	delay = 0,
	trigger = 'inView',
	once = true,
	amount = 0.25,
}): ReactElement => {
	const { ref, inView } = useInView({
		threshold: amount,
		triggerOnce: once,
		skip: trigger !== 'inView',
	});
	const mounted = useRevealOnMount(trigger === 'mount');
	const revealed = trigger === 'mount' ? mounted : inView;

	return (
		<div
			ref={ref}
			className={[styles.RevealImage, className].filter(Boolean).join(' ')}
			data-revealed={revealed}
			style={{ '--reveal-delay': `${delay}s` } as CSSProperties}
		>
			<div className={styles.RevealImage__media}>{children}</div>
		</div>
	);
};

export default RevealImage;
