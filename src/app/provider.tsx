'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect } from 'react';

import { ThemeProvider } from 'contexts/ThemeContext';
import { init } from 'helpers/analytics';

interface ProviderProps {
	children: React.ReactNode;
}

export default function Provider({
	children,
}: Readonly<ProviderProps>): React.ReactElement {
	useEffect(() => {
		init();
	}, []);

	return (
		<ThemeProvider>
			<main>
				<ReactLenis root>{children}</ReactLenis>
			</main>
		</ThemeProvider>
	);
}
