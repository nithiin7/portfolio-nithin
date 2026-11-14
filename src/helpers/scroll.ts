import type Lenis from 'lenis';

/** Smooth-scrolls Lenis to the element with the given id. */
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
