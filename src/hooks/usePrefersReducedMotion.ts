import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void): (() => void) => {
	const mql = window.matchMedia(QUERY);
	mql.addEventListener('change', onChange);
	return () => mql.removeEventListener('change', onChange);
};

/**
 * Hydration-safe: the server snapshot is always `false`, so the first client
 * render matches SSR markup before React switches to the real preference.
 */
export const usePrefersReducedMotion = (): boolean =>
	useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false
	);
