'use client';
import { useEffect, ReactNode, ReactElement } from 'react';
import AOS from 'aos';
import { ReactLenis } from '@studio-freight/react-lenis';

import 'aos/dist/aos.css';

interface ProviderProps {
	children: ReactNode;
}

export default function Provider({
	children,
}: Readonly<ProviderProps>): ReactElement {
	useEffect(() => {
		AOS.init();
	}, []);

	return (
		<main>
			<ReactLenis root>{children}</ReactLenis>
		</main>
	);
}
