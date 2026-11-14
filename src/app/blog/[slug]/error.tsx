'use client';
import type { ReactElement } from 'react';

import RouteError from 'components/utilities/RouteError/RouteError';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/** Error screen for a blog post. */
export default function BlogDetailError({
	error,
	reset,
}: ErrorProps): ReactElement {
	return (
		<RouteError
			error={error}
			reset={reset}
			title="Failed to load this article"
			message="Something went wrong fetching this post. Try again or browse other articles."
			back={{ href: '/blog', label: 'Back to blog' }}
		/>
	);
}
