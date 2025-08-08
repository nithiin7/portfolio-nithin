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

			if (currentScrollY > lastScrollY) {
				setScrollDirection('down');
			} else if (currentScrollY < lastScrollY) {
				setScrollDirection('up');
			}

			setScrollY(currentScrollY);

			if (currentScrollY <= 0) {
				setIsVisible(true);
			} else if (scrollDirection === 'up') {
				setIsVisible(true);
			} else if (scrollDirection === 'down') {
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
	}, [scrollDirection]);

	return { isVisible, scrollDirection, scrollY };
};
