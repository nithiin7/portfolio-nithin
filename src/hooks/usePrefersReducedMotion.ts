import { useMediaQuery } from 'hooks/useMediaQuery';

/** Whether the user prefers reduced motion. */
export const usePrefersReducedMotion = (): boolean =>
	useMediaQuery('(prefers-reduced-motion: reduce)');
