import { useMediaQuery } from 'hooks/useMediaQuery';

export const usePrefersReducedMotion = (): boolean =>
	useMediaQuery('(prefers-reduced-motion: reduce)');
