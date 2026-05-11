import { useEffect, useState } from 'react';

interface UseScrollDirectionReturn {
	isVisible: boolean;
	scrollDirection: 'up' | 'down' | null;
	scrollY: number;
}

/**
 * Custom hook to track scroll direction and visibility
 * @returns The scroll direction, scroll position, and visibility
 */
export const useScrollDirection = (): UseScrollDirectionReturn => {
	const [scrollY, setScrollY] = useState(0);
	const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(
		null
	);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		let lastScrollY = window.scrollY;
		let ticking = false;

		const updateScrollDirection = () => {
			const currentScrollY = window.scrollY;
			const direction =
				currentScrollY > lastScrollY
					? 'down'
					: currentScrollY < lastScrollY
						? 'up'
						: null;

			if (direction) {
				setScrollDirection(direction);
			}

			setScrollY(currentScrollY);

			if (currentScrollY <= 0) {
				setIsVisible(true);
			} else if (direction === 'up') {
				setIsVisible(true);
			} else if (direction === 'down') {
				setIsVisible(false);
			}

			lastScrollY = currentScrollY;
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateScrollDirection);
				ticking = true;
			}
		};

		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return { isVisible, scrollDirection, scrollY };
};
