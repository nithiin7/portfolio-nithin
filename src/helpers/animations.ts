import type { Variants } from 'motion/react';

import { duration, ease } from 'styles/tokens';

export const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
};

export const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: duration.fast, ease } },
	exit: { opacity: 0, transition: { duration: duration.fast, ease } },
};
