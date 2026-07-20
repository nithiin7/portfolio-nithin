'use client';
import { ReactLenis } from 'lenis/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ThemeProvider } from 'contexts/ThemeContext';

interface ProviderProps {
	children: React.ReactNode;
}

export default function Provider({
	children,
}: Readonly<ProviderProps>): React.ReactElement {
	return (
		<NuqsAdapter>
			<ThemeProvider>
				<main>
					<ReactLenis root>{children}</ReactLenis>
				</main>
			</ThemeProvider>
		</NuqsAdapter>
	);
}
