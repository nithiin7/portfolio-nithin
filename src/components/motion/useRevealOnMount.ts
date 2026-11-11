import { useEffect, useState } from 'react';

/**
 * Flips to true one frame after mount so CSS transitions start from their
 * initial (hidden) state instead of jumping straight to the end.
 */
export const useRevealOnMount = (enabled: boolean): boolean => {
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		if (!enabled) return;
		const frame = requestAnimationFrame(() => setRevealed(true));
		return () => cancelAnimationFrame(frame);
	}, [enabled]);

	return revealed;
};
