'use client';
import { useLenis } from 'lenis/react';
import type { ReactElement } from 'react';

import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';

import styles from './Footer.module.scss';

/** Button that scrolls back to the top of the page. */
const FooterBackToTop = (): ReactElement => {
	const lenis = useLenis();
	const reduced = usePrefersReducedMotion();

	const backToTop = (): void => {
		if (lenis) lenis.scrollTo(0, { immediate: reduced });
		else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
		document.getElementById('main-content')?.focus({ preventScroll: true });
	};

	return (
		<button type="button" className={styles.Footer__top} onClick={backToTop}>
			<span className={styles.Footer__underline}>Back to top</span>
			<span aria-hidden="true">↑</span>
		</button>
	);
};

export default FooterBackToTop;
