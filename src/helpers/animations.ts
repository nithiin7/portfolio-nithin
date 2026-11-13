import type { Variants } from 'motion/react';

import { duration, ease } from 'styles/tokens';

/** Plain opacity swap; the reduced-motion stand-in for overlay panels. */
export const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
};

/** Backdrop fade shared by the modal and command palette scrims. */
export const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: duration.fast, ease } },
	exit: { opacity: 0, transition: { duration: duration.fast, ease } },
};
