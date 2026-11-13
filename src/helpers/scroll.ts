import type Lenis from 'lenis';

/**
 * Smooth-scrolls (Lenis) to the element with id `to`.
 *
 * Resolves the target's position via the offsetTop/offsetParent chain rather
 * than a selector or getBoundingClientRect: some sections apply a CSS
 * transform (scroll-linked entrance animation) that is still settling when
 * the scroll starts, so a transform-based measurement produces a moving
 * target and the scroll overshoots.
 */
export const handleScroll = (to: string, lenis: Lenis | undefined) => {
	if (!lenis) return;

	const target = document.getElementById(to);
	if (!target) return;

	let top = 0;
	let el: HTMLElement | null = target;

	while (el) {
		top += el.offsetTop;
		el = el.offsetParent as HTMLElement | null;
	}

	lenis.scrollTo(top, {
		duration: 2,
	});
};
