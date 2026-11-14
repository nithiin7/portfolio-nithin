import { useEffect, useState } from 'react';

interface UseScrollDirectionOptions {
	revealZone?: number;
	tolerance?: number;
}

interface UseScrollDirectionReturn {
	isVisible: boolean;
	isAtTop: boolean;
}

export const useScrollDirection = ({
	revealZone = 80,
	tolerance = 6,
}: UseScrollDirectionOptions = {}): UseScrollDirectionReturn => {
	const [isVisible, setIsVisible] = useState(true);
	const [isAtTop, setIsAtTop] = useState(true);

	useEffect(() => {
		let lastY = window.scrollY;
		let frame = 0;

		const update = () => {
			frame = 0;
			const y = window.scrollY;
			const delta = y - lastY;

			setIsAtTop(y <= revealZone);

			if (y <= revealZone) {
				setIsVisible(true);
			} else if (Math.abs(delta) >= tolerance) {
				setIsVisible(delta < 0);
			} else {
				return;
			}
			lastY = y;
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [revealZone, tolerance]);

	return { isVisible, isAtTop };
};
