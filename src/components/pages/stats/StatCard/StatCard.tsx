import type { FC, ReactElement, ReactNode } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

import styles from './StatCard.module.scss';

export interface StatCardProps {
	icon: ReactNode;
	title: string;
	subtitle?: string;
	href?: string;
	linkLabel?: string;
	live?: boolean;
	children: ReactNode;
	className?: string;
}

const StatCard: FC<StatCardProps> = ({
	icon,
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
			<span className={styles.StatCard__icon}>{icon}</span>
			<div className={styles.StatCard__heading}>
				<h2>{title}</h2>
				{subtitle && <span>{subtitle}</span>}
			</div>
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
					aria-label={linkLabel ?? `Open ${title}`}
					className={styles.StatCard__link}
				>
					<FiArrowUpRight />
				</a>
			)}
		</header>
		<div className={styles.StatCard__body}>{children}</div>
	</article>
);

export const StatCardDivider: FC = (): ReactElement => (
	<hr className={styles.StatCard__divider} />
);

export const StatCardSection: FC<{ children: ReactNode }> = ({
	children,
}): ReactElement => (
	<span className={styles.StatCard__section}>{children}</span>
);

export default StatCard;
