'use client';
import Link from 'next/link';
import { useEffect, type FC, type ReactElement } from 'react';

import { captureException } from 'helpers/monitoring';

import styles from './RouteError.module.scss';

export interface RouteErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
	title: string;
	message: string;
	back: { href: string; label: string };
}

/** Error screen with retry and back links. */
const RouteError: FC<RouteErrorProps> = ({
	error,
	reset,
	title,
	message,
	back,
}): ReactElement => {
	useEffect(() => {
		captureException(error);
	}, [error]);

	return (
		<div className={styles.RouteError}>
			<div className={styles.RouteError__inner}>
				<p className={styles.RouteError__code}>Error 500</p>
				<h1 className={styles.RouteError__title}>{title}</h1>
				<p className={styles.RouteError__message}>{message}</p>
				<div className={styles.RouteError__actions}>
					<button
						type="button"
						className={styles.RouteError__retry}
						onClick={reset}
					>
						<span className={styles.roll}>
							<span>Try again</span>
							<span aria-hidden="true">Try again</span>
						</span>
					</button>
					<Link href={back.href} className={styles.RouteError__back}>
						{back.label}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RouteError;
