import type { FC, ReactElement, ReactNode } from 'react';

import styles from './StatMetric.module.scss';

interface StatMetricProps {
	value: ReactNode;
	label: string;
}

const StatMetric: FC<StatMetricProps> = ({ value, label }): ReactElement => (
	<div className={styles.StatMetric}>
		<span className={styles.StatMetric__value}>{value}</span>
		<span className={styles.StatMetric__label}>{label}</span>
	</div>
);

export default StatMetric;
