'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import AOS from 'aos';
import type { ReactNode, ReactElement } from 'react';
import { useEffect } from 'react';

import 'aos/dist/aos.css';
import { init } from 'services/analytics';

interface ProviderProps {
	children: ReactNode;
}

export default function Provider({ children }: Readonly<ProviderProps>): ReactElement {
	useEffect(() => {
		console.log(
			`
			%c  _______  __    _  __   __  _______  __   __ 
			 |       ||  |  | ||  | |  ||       ||  | |  |
			 |    ___||   |_| ||  |_|  ||   _   ||  |_|  |
			 |   |___ |       ||       ||  | |  ||       |
			 |    ___||  _    ||_     _||  |_|  ||_     _|
			 |   |___ | | |   |  |   |  |       |  |   |  
			 |_______||_|  |__|  |___|  |_______|  |___|  
			`,
			'color: cyan; font-size: 12px;'
		);
		init();
		AOS.init();
	}, []);

	return (
		<main>
			<ReactLenis root>{children}</ReactLenis>
		</main>
	);
}
