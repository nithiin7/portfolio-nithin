'use client';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import styles from './error.module.scss';

interface PortfolioErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function PortfolioError({
	error,
	reset,
}: PortfolioErrorProps): React.ReactElement {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className={styles.PortfolioError}>
			<div className={styles.PortfolioError__content}>
				<p className={styles.PortfolioError__code}>500</p>
				<h1 className={styles.PortfolioError__title}>
					Failed to load this project
				</h1>
				<p className={styles.PortfolioError__message}>
					Something went wrong fetching this project. Try again or go back to
					the homepage.
				</p>
				<div className={styles.PortfolioError__actions}>
					<button className={styles.PortfolioError__retry} onClick={reset}>
						Try again
					</button>
					<Link href="/" className={styles.PortfolioError__back}>
						Go home
					</Link>
				</div>
			</div>
		</div>
	);
}
