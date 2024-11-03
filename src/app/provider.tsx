'use client';
import { useEffect, ReactNode } from 'react';
import AOS from 'aos';
import { ReactLenis } from '@studio-freight/react-lenis';

import 'aos/dist/aos.css';

interface ProviderProps {
	children: ReactNode;
}

export default function Provider({ children }: ProviderProps): JSX.Element {
	useEffect(() => {
		AOS.init();
	}, []);

	return (
		<main>
			<ReactLenis root>{children}</ReactLenis>
		</main>
	);
}
