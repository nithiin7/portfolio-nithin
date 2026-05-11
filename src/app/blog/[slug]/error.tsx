'use client';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import styles from './error.module.scss';

interface BlogDetailErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function BlogDetailError({
	error,
	reset,
}: BlogDetailErrorProps): React.ReactElement {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className={styles.BlogDetailError}>
			<div className={styles.BlogDetailError__content}>
				<p className={styles.BlogDetailError__code}>500</p>
				<h1 className={styles.BlogDetailError__title}>
					Failed to load this article
				</h1>
				<p className={styles.BlogDetailError__message}>
					Something went wrong fetching this post. Try again or browse other
					articles.
				</p>
				<div className={styles.BlogDetailError__actions}>
					<button className={styles.BlogDetailError__retry} onClick={reset}>
						Try again
					</button>
					<Link href="/blog" className={styles.BlogDetailError__back}>
						Back to blog
					</Link>
				</div>
			</div>
		</div>
	);
}
