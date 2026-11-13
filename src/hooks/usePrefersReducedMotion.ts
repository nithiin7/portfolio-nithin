import { useMediaQuery } from 'hooks/useMediaQuery';

/** Live `prefers-reduced-motion: reduce` match; false during SSR. */
export const usePrefersReducedMotion = (): boolean =>
	useMediaQuery('(prefers-reduced-motion: reduce)');
