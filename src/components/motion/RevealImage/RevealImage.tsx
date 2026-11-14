'use client';

import type { CSSProperties, FC, ReactElement, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

import { useRevealOnMount } from 'components/motion/useRevealOnMount';

import styles from './RevealImage.module.scss';

export interface RevealImageProps {
	children: ReactNode;
	className?: string;
	delay?: number;
	trigger?: 'inView' | 'mount';
	once?: boolean;
	amount?: number;
}

/** Reveals its children with a clip-path wipe. */
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
			<div className={styles.RevealImage__mask}>
				<div className={styles.RevealImage__media}>{children}</div>
			</div>
		</div>
	);
};

export default RevealImage;
