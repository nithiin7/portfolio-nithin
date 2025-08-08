'use client';
import type { Variants } from 'motion/react';
import { motion } from 'motion/react';

import { curve, translate } from 'helpers/animations';

interface TransitionSVGProps {
	height: number;
	width: number;
}

const anim = (variants: Variants) => {
	return {
		variants,
		initial: 'initial',
		animate: 'enter',
		exit: 'exit',
	};
};

const TransitionSVG = ({
	height,
	width,
}: TransitionSVGProps): React.ReactElement => {
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
			<motion.path {...anim(curve(initialPath, targetPath))} fill="black" />
		</motion.svg>
	);
};

export default TransitionSVG;
