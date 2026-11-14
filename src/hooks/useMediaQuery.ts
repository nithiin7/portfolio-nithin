import { useCallback, useSyncExternalStore } from 'react';

/** Whether a media query matches, kept in sync. */
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
