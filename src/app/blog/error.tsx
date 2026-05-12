'use client';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import styles from './error.module.scss';

interface BlogErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function BlogError({
	error,
	reset,
}: BlogErrorProps): React.ReactElement {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className={styles.BlogError}>
			<div className={styles.BlogError__content}>
				<p className={styles.BlogError__code}>500</p>
				<h1 className={styles.BlogError__title}>Failed to load articles</h1>
				<p className={styles.BlogError__message}>
					Something went wrong fetching the blog. This is usually temporary —
					try again or head back home.
				</p>
				<div className={styles.BlogError__actions}>
					<button className={styles.BlogError__retry} onClick={reset}>
						Try again
					</button>
					<Link href="/" className={styles.BlogError__back}>
						Go home
					</Link>
				</div>
			</div>
		</div>
	);
}
