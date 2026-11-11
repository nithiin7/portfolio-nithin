import { useCallback, useSyncExternalStore } from 'react';

/**
 * Hydration-safe: the server snapshot is always `false`, so the first client
 * render matches SSR markup before React switches to the real value.
 */
export const useMediaQuery = (query: string): boolean => {
	const subscribe = useCallback(
		(onChange: () => void): (() => void) => {
			const mql = window.matchMedia(query);
			mql.addEventListener('change', onChange);
			return () => mql.removeEventListener('change', onChange);
		},
		[query]
	);

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(query).matches,
		() => false
	);
};
