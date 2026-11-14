import { useEffect, useState } from 'react';

export const useRevealOnMount = (enabled: boolean): boolean => {
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		if (!enabled) return;
		const frame = requestAnimationFrame(() => setRevealed(true));
		return () => cancelAnimationFrame(frame);
	}, [enabled]);

	return revealed;
};
