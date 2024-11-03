'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import { ReactLenis } from '@studio-freight/react-lenis';

import 'aos/dist/aos.css';

export default function Provider({ children }) {
	useEffect(() => {
		AOS.init();
	}, []);

	return (
		<main>
			<ReactLenis root>{children}</ReactLenis>
		</main>
	);
}
