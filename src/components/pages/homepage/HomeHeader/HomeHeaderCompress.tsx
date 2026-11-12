'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';
import { useRef } from 'react';

import { useLiteMotion } from 'hooks/useLiteMotion';

interface HomeHeaderCompressProps {
	children: ReactNode;
	className?: string;
}

/** Scales the hero name 1 → 0.92 as it scrolls out of view. */
const HomeHeaderCompress = ({
	children,
	className,
}: HomeHeaderCompressProps): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);
	const lite = useLiteMotion();
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['end end', 'end start'],
	});
	const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

	return (
		<motion.div
			ref={ref}
			className={className}
			style={lite ? undefined : { scale, transformOrigin: 'left bottom' }}
		>
			{children}
		</motion.div>
	);
};

export default HomeHeaderCompress;
