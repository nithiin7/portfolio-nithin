'use client';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { usePathname } from 'next/navigation';
import { text, curve, translate } from 'helpers/animations';

interface CurveProps {
	children: ReactNode;
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

const Curve = ({ children, backgroundColor }: CurveProps): ReactElement => {
	const [dimensions, setDimensions] = useState<Dimensions>({
		width: null,
		height: null,
	});

	const pathname = usePathname();

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
						{pathname === '/contact' ? "Let's Connect." : 'Welcome.'}
					</motion.p>
				</motion.div>
				{dimensions.width != null && dimensions.height != null && (
					<SVG width={dimensions.width} height={dimensions.height} />
				)}
				{children}
			</div>
		</AnimatePresence>
	);
};

export default Curve;

interface SVGProps {
	height: number;
	width: number;
}

const SVG = ({ height, width }: SVGProps): ReactElement => {
	const initialPath = `
        M0 300 
        Q${width / 2} 0 ${width} 300
        L${width} ${height + 300}
        Q${width / 2} ${height + 600} 0 ${height + 300}
        L0 0
    `;

	const targetPath = `
        M0 300
        Q${width / 2} 0 ${width} 300
        L${width} ${height}
        Q${width / 2} ${height} 0 ${height}
        L0 0
    `;

	return (
		<motion.svg className="motion-svg" {...anim(translate)}>
			<motion.path {...anim(curve(initialPath, targetPath))} />
		</motion.svg>
	);
};
