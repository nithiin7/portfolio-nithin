import { useEffect, useState } from 'react';

/** True from the frame after mount while enabled. */
export const useRevealOnMount = (enabled: boolean): boolean => {
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		if (!enabled) return;
		const frame = requestAnimationFrame(() => setRevealed(true));
		return () => cancelAnimationFrame(frame);
	}, [enabled]);

	return revealed;
};
