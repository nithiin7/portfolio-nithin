import { useSyncExternalStore } from 'react';

import { useMediaQuery } from 'hooks/useMediaQuery';

interface NavigatorHints {
	connection?: { saveData?: boolean };
	deviceMemory?: number;
}

const subscribeNoop = (): (() => void) => () => undefined;

const lowPowerSnapshot = (): boolean => {
	const nav = navigator as Navigator & NavigatorHints;
	return (
		nav.connection?.saveData === true ||
		(nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
	);
};

/**
 * True when scroll-scrubbed and velocity-driven effects should be skipped:
 * reduced motion, phones (small + touch), Save-Data, or low-memory devices.
 * Server snapshot is false, so SSR markup matches the full-motion render.
 */
export const useLiteMotion = (): boolean => {
	const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
	const phone = useMediaQuery('(pointer: coarse) and (max-width: 767px)');
	const lowPower = useSyncExternalStore(
		subscribeNoop,
		lowPowerSnapshot,
		() => false
	);
	return reduced || phone || lowPower;
};
