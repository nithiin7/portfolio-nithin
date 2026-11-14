'use client';
import { useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import { useLayoutEffect, ViewTransition } from 'react';

import styles from './PageTransition.module.scss';

interface PageTransitionProps {
	children: ReactNode;
}

/**
 * Route change = the keyed boundary exits and a new one enters, so React runs
 * a View Transition with the `page-exit` / `page-enter` classes styled in
 * globals.scss. In-page updates (filters, pagination) are not animated.
 */
const PageTransition = ({ children }: PageTransitionProps): ReactElement => {
	const pathname = usePathname();
	const lenis = useLenis();

	// Must be a layout effect: the scroll reset has to land before React
	// captures the new snapshot, or the new page wipes in at the old offset.
	useLayoutEffect(() => {
		if (!lenis) return;
		// Reset before resize(): resize syncs targetScroll to the live position,
		// after which scrollTo() returns early and leaves a smooth scroll started
		// on the old page running on the new one. `force` because the menu may
		// still have Lenis stopped when the route commits.
		lenis.scrollTo(0, { immediate: true, force: true });
		lenis.resize();
		const targetId = window.location.hash.slice(1);
		const target = targetId ? document.getElementById(targetId) : null;
		if (target) lenis.scrollTo(target, { immediate: true, force: true });
	}, [pathname, lenis]);

	return (
		<ViewTransition
			key={pathname}
			enter="page-enter"
			exit="page-exit"
			default="none"
		>
			<div className={styles.PageTransition}>{children}</div>
		</ViewTransition>
	);
};

export default PageTransition;
