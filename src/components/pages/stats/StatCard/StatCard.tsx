import type { FC, ReactElement, ReactNode } from 'react';

import { EXTERNAL_ARROW } from 'constants/index';

import styles from './StatCard.module.scss';

export interface StatCardProps {
	title: string;
	subtitle?: string;
	href?: string;
	linkLabel?: string;
	live?: boolean;
	children: ReactNode;
	className?: string;
}

/** Numbered by a CSS counter on the Stats grid, so cards stay index-free. */
const StatCard: FC<StatCardProps> = ({
	title,
	subtitle,
	href,
	linkLabel,
	live = false,
	children,
	className = '',
}): ReactElement => (
	<article className={`${styles.StatCard} ${className}`}>
		<header className={styles.StatCard__header}>
			<div className={styles.StatCard__heading}>
				<h2>{title}</h2>
				{subtitle && <p>{subtitle}</p>}
			</div>
			<div className={styles.StatCard__meta}>
				{live && (
					<span className={styles.StatCard__live}>
						<span className={styles.StatCard__pulse} aria-hidden="true" />
						Live
					</span>
				)}
				{href && (
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.StatCard__link}
					>
						{linkLabel ?? `Open ${title}`}
						<span aria-hidden="true"> {EXTERNAL_ARROW}</span>
						<span className={styles.StatCard__sr}> (opens in a new tab)</span>
					</a>
				)}
			</div>
		</header>
		<div className={styles.StatCard__body}>{children}</div>
	</article>
);

/** Row of headline StatMetrics at the top of a card. */
export const StatCardMetrics: FC<{ children: ReactNode }> = ({
	children,
}): ReactElement => <div className={styles.StatCard__metrics}>{children}</div>;

export const StatCardDivider: FC = (): ReactElement => (
	<hr className={styles.StatCard__divider} />
);

export const StatCardSection: FC<{ children: ReactNode }> = ({
	children,
}): ReactElement => <h3 className={styles.StatCard__section}>{children}</h3>;

export default StatCard;
