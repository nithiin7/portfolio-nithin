import type { Variants } from 'motion/react';

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

/**
 * Animation configuration for the menu items.
 */
export const animate = {
	initial: {
		opacity: 0,
		y: '100%',
		scale: 0.8,
	},
	enter: (i: number) => ({
		opacity: 1,
		y: '0',
		scale: 1,
		transition: {
			delay: 0.3 + i * 0.08,
			ease: [0.76, 0, 0.24, 1],
			duration: 0.6,
		},
	}),
	exit: {
		opacity: 0,
		y: '50%',
		scale: 0.9,
		transition: {
			ease: [0.76, 0, 0.24, 1],
			duration: 0.4,
		},
	},
};

/**
 * Animation states for the menu visibility.
 */
export const menu = {
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			ease: [0.76, 0, 0.24, 1],
			duration: 0.6,
		},
	},
	hidden: {
		opacity: 0,
		scale: 0,
		transition: {
			ease: [0.76, 0, 0.24, 1],
			duration: 0.4,
		},
	},
};

/**
 * Animation variants for opening and closing the menu container.
 */
export const variants = {
	open: {
		width: '36rem',
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.75,
			ease: [0.76, 0, 0.24, 1],
			opacity: { delay: 0.1, duration: 0.4 },
			scale: { delay: 0.05, duration: 0.5 },
		},
	},
	closed: {
		width: 0,
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: 0.75,
			ease: [0.76, 0, 0.24, 1],
			opacity: { duration: 0.3 },
			scale: { duration: 0.4 },
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: 0.5,
			ease: [0.76, 0, 0.24, 1],
		},
	},
};

/**
 * Animation variants for the backdrop overlay.
 */
export const backdropVariants = {
	open: {
		opacity: 1,
		backdropFilter: 'blur(8px)',
		transition: {
			duration: 0.4,
			ease: [0.76, 0, 0.24, 1],
			backdropFilter: { delay: 0.1, duration: 0.3 },
		},
	},
	closed: {
		opacity: 0,
		backdropFilter: 'blur(0px)',
		transition: {
			duration: 0.3,
			ease: [0.76, 0, 0.24, 1],
		},
	},
};

/**
 * Animation for the background decoration.
 */
export const backgroundVariants = {
	initial: {
		opacity: 0,
		scale: 0.8,
		rotate: -10,
	},
	enter: {
		opacity: 0.25,
		scale: 1,
		rotate: 0,
		transition: {
			delay: 0.4,
			duration: 0.8,
			ease: [0.76, 0, 0.24, 1],
		},
	},
	exit: {
		opacity: 0,
		scale: 0.8,
		rotate: 10,
		transition: {
			duration: 0.4,
			ease: [0.76, 0, 0.24, 1],
		},
	},
};
