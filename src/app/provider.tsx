'use client';
import { SerwistProvider } from '@serwist/turbopack/react';
import { ReactLenis } from 'lenis/react';
import { MotionConfig } from 'motion/react';

import { ThemeProvider } from 'contexts/ThemeContext';

interface ProviderProps {
	children: React.ReactNode;
}

/** Client providers: theme, motion config, Lenis and the service worker. */
export default function Provider({
	children,
}: Readonly<ProviderProps>): React.ReactElement {
	return (
		<SerwistProvider
			swUrl="/serwist/sw.js"
			disable={process.env.NODE_ENV !== 'production'}
			reloadOnOnline
		>
			<ThemeProvider>
				<MotionConfig reducedMotion="user">
					<ReactLenis root>{children}</ReactLenis>
				</MotionConfig>
			</ThemeProvider>
		</SerwistProvider>
	);
}
