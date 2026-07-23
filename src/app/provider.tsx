'use client';
import { SerwistProvider } from '@serwist/turbopack/react';
import { ReactLenis } from 'lenis/react';
import { MotionConfig } from 'motion/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ThemeProvider } from 'contexts/ThemeContext';

interface ProviderProps {
	children: React.ReactNode;
}

export default function Provider({
	children,
}: Readonly<ProviderProps>): React.ReactElement {
	return (
		<SerwistProvider
			swUrl="/serwist/sw.js"
			disable={process.env.NODE_ENV !== 'production'}
			reloadOnOnline
		>
			<NuqsAdapter>
				<ThemeProvider>
					<MotionConfig reducedMotion="user">
						<ReactLenis root>{children}</ReactLenis>
					</MotionConfig>
				</ThemeProvider>
			</NuqsAdapter>
		</SerwistProvider>
	);
}
