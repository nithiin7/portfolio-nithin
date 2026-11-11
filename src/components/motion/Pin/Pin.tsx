'use client';

import { useMotionValue, useScroll, type MotionValue } from 'motion/react';
import {
	useRef,
	type CSSProperties,
	type FC,
	type ReactElement,
	type ReactNode,
} from 'react';

import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';

import styles from './Pin.module.scss';

export interface PinProps {
	/** Static content, or a render function receiving scroll progress (0 → 1). */
	children: ReactNode | ((progress: MotionValue<number>) => ReactNode);
	/** Extra scroll, in viewport heights, the content stays pinned for. */
	distance?: number;
	className?: string;
}

/**
 * Pins its content for `distance` viewports and exposes scroll progress
 * through the pinned range. Built on `position: sticky` + Motion's useScroll
 * rather than a GSAP pin-spacer, so there is no layout reparenting and it
 * cooperates with Lenis (native scroll). Under prefers-reduced-motion the
 * section is not pinned and progress is fixed at 1 (final state).
 */
const Pin: FC<PinProps> = ({
	children,
	distance = 1,
	className,
}): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);
	const reduced = usePrefersReducedMotion();
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start start', 'end end'],
	});
	const settled = useMotionValue(1);
	const progress = reduced ? settled : scrollYProgress;

	return (
		<div
			ref={ref}
			className={[styles.Pin, className].filter(Boolean).join(' ')}
			style={{ '--pin-distance': distance } as CSSProperties}
		>
			<div className={styles.Pin__sticky}>
				{typeof children === 'function' ? children(progress) : children}
			</div>
		</div>
	);
};

export default Pin;
