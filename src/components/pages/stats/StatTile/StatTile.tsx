import type { FC, ReactElement, ReactNode } from 'react';

import styles from './StatTile.module.scss';

interface StatTileProps {
	label: string;
	value: ReactNode;
	note?: string;
}

const StatTile: FC<StatTileProps> = ({ label, value, note }): ReactElement => (
	<div className={styles.StatTile}>
		<span className={styles.StatTile__label}>{label}</span>
		<span className={styles.StatTile__value}>{value}</span>
		{note && <span className={styles.StatTile__note}>{note}</span>}
	</div>
);

export default StatTile;
