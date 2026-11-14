'use client';
import type { ReactElement } from 'react';

import RouteError from 'components/utilities/RouteError/RouteError';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function BlogError({ error, reset }: ErrorProps): ReactElement {
	return (
		<RouteError
			error={error}
			reset={reset}
			title="Failed to load articles"
			message="Something went wrong fetching the blog. It’s usually temporary, so try again or head back home."
			back={{ href: '/', label: 'Go home' }}
		/>
	);
}
