'use client';
import NextError from 'next/error';
import { useEffect } from 'react';

import { captureException } from 'helpers/monitoring';

/** Last-resort error screen when the root layout fails. */
export default function GlobalError({
	error,
}: {
	error: Error & { digest?: string };
}) {
	useEffect(() => {
		captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<NextError statusCode={0} />
			</body>
		</html>
	);
}
