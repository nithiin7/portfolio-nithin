'use client';
import { useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import { useLayoutEffect, ViewTransition } from 'react';

import styles from './PageTransition.module.scss';

interface PageTransitionProps {
	children: ReactNode;
}

/** Wraps the page in the route-change view transition. */
const PageTransition = ({ children }: PageTransitionProps): ReactElement => {
	const pathname = usePathname();
	const lenis = useLenis();

	useLayoutEffect(() => {
		if (!lenis) return;
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
