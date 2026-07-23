'use client';

import { motion, useInView } from 'motion/react';
import type { FC, ReactElement } from 'react';
import { useRef } from 'react';

import styles from './MeterBar.module.scss';

interface MeterBarProps {
	label: string;
	percent: number;
	detail?: string;
	delay?: number;
}

const MeterBar: FC<MeterBarProps> = ({
	label,
	percent,
	detail,
	delay = 0,
}): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);

	const isInView = useInView(ref, { once: true, margin: '-40px' });

	return (
		<div ref={ref} className={styles.MeterBar}>
			<div className={styles.MeterBar__row}>
				<span className={styles.MeterBar__label}>{label}</span>
				{detail && <span className={styles.MeterBar__detail}>{detail}</span>}
			</div>
			<div className={styles.MeterBar__track}>
				<motion.div
					className={styles.MeterBar__fill}
					style={{ width: `${Math.max(Math.min(percent, 100), 1)}%` }}
					initial={{ scaleX: 0 }}
					animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
					transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
				/>
			</div>
		</div>
	);
};

export default MeterBar;
