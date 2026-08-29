import type { FC, ReactElement } from 'react';

import { formatDate } from 'helpers';
import type { NowActivityItem } from 'types/activity';

import styles from './NowActivity.module.scss';

interface NowActivityProps {
	items: NowActivityItem[];
}

const NowActivity: FC<NowActivityProps> = ({ items }): ReactElement | null => {
	if (items.length === 0) return null;

	return (
		<div className={styles.NowActivity}>
			<span className={styles.NowActivity__label}>
				<span className={styles.NowActivity__dot} aria-hidden="true" />
				Right now
			</span>
			<ul className={styles.NowActivity__list}>
				{items.map((item) => (
					<li key={item.id}>
						{item.url ? (
							<a href={item.url} target="_blank" rel="noopener noreferrer">
								{item.label}
							</a>
						) : (
							<span>{item.label}</span>
						)}
						<span className={styles.NowActivity__time}>
							{formatDate(item.timestamp, 'relative')}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default NowActivity;
