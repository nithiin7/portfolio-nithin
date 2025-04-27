import { Variants } from 'motion/react';

export const text: Variants = {
	initial: {
		opacity: 1,
	},
	enter: {
		opacity: 0,
		top: -100,
		transition: { duration: 1, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
		transitionEnd: { top: '47.5%' },
	},
	exit: {
		opacity: 1,
		top: '40%',
		transition: { duration: 0.5, delay: 0.4, ease: [0.33, 1, 0.68, 1] },
	},
};

export const curve = (initialPath: string, targetPath: string): Variants => {
	return {
		initial: {
			d: initialPath,
		},
		enter: {
			d: targetPath,
			transition: { duration: 1, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
		},
		exit: {
			d: initialPath,
			transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
		},
	};
};

export const translate: Variants = {
	initial: {
		top: '-300px',
	},
	enter: {
		top: '-100vh',
		transition: { duration: 1, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
		transitionEnd: {
			top: '100vh',
		},
	},
	exit: {
		top: '-300px',
		transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
	},
};
