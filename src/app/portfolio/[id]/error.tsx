'use client';
import type { ReactElement } from 'react';

import { RouteError } from 'components/utilities';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function PortfolioError({
	error,
	reset,
}: ErrorProps): ReactElement {
	return (
		<RouteError
			error={error}
			reset={reset}
			title="Failed to load this project"
			message="Something went wrong fetching this project. Try again or go back to the homepage."
			back={{ href: '/', label: 'Go home' }}
		/>
	);
}
