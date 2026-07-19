'use client';
import { ReactLenis } from 'lenis/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
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
		<NuqsAdapter>
			<ThemeProvider>
				<main>
					<ReactLenis root>{children}</ReactLenis>
				</main>
			</ThemeProvider>
		</NuqsAdapter>
	);
}
