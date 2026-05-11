'use client';
import { useLenis } from '@studio-freight/react-lenis';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { TransitionSVG } from 'components/utilities';
import { text } from 'helpers/animations';

interface CurveProps {
	children: React.ReactNode;
	backgroundColor?: string;
}

interface Dimensions {
	width: number | null;
	height: number | null;
}

const anim = (variants: Variants) => {
	return {
		variants,
		initial: 'initial',
		animate: 'enter',
		exit: 'exit',
	};
};

const getPageWelcomeText = (pathname: string): string => {
	switch (pathname) {
		case '/':
			return 'Welcome.';
		case '/contact':
			return "Let's Connect.";
		case '/blog':
			return 'Explore Stories.';
		case '/portfolio':
			return 'Discover Work.';
		default:
			if (pathname.startsWith('/blog/')) {
				return 'Read & Reflect.';
			}
			if (pathname.startsWith('/portfolio/')) {
				return 'View Project.';
			}
			return 'Welcome.';
	}
};

const Curve = ({
	children,
	backgroundColor,
}: CurveProps): React.ReactElement => {
	const [dimensions, setDimensions] = useState<Dimensions>({
		width: null,
		height: null,
	});

	const pathname = usePathname();
	const lenis = useLenis();

	useEffect(() => {
		lenis?.scrollTo(0, { immediate: true });
	}, [pathname, lenis]);

	useEffect(() => {
		const resize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		resize();
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, []);

	return (
		<AnimatePresence mode="wait">
			<div className="page curve" style={{ backgroundColor }}>
				<div
					style={{ opacity: dimensions.width == null ? 1 : 0 }}
					className="background"
				/>
				<motion.div className="welcome" {...anim(text)}>
					<motion.p
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						{getPageWelcomeText(pathname)}
					</motion.p>
				</motion.div>
				{dimensions.width != null && dimensions.height != null && (
					<TransitionSVG width={dimensions.width} height={dimensions.height} />
				)}
				<div>{children}</div>
			</div>
		</AnimatePresence>
	);
};

export default Curve;
