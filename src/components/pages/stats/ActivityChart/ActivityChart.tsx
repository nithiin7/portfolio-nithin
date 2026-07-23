'use client';

import { motion, useInView } from 'motion/react';
import type { FC, ReactElement } from 'react';
import { useRef } from 'react';

import type { WakaTimeDay } from 'types/wakatime';

import styles from './ActivityChart.module.scss';

interface ActivityChartProps {
	days: WakaTimeDay[];
}

const formatDay = (date: string): string =>
	new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	});

const weekdayLetter = (date: string): string =>
	new Date(`${date}T00:00:00`)
		.toLocaleDateString('en-US', { weekday: 'narrow' })
		.toUpperCase();

const ActivityChart: FC<ActivityChartProps> = ({ days }): ReactElement => {
	const ref = useRef<HTMLDivElement>(null);

	const isInView = useInView(ref, { once: true, margin: '-40px' });
	const max = Math.max(...days.map((day) => day.totalSeconds), 1);

	return (
		<div
			ref={ref}
			className={styles.ActivityChart}
			role="img"
			aria-label={`Coding activity per day over the last ${days.length} days`}
		>
			{days.map((day, index) => (
				<div key={day.date} className={styles.ActivityChart__column}>
					<span className={styles.ActivityChart__tooltip} aria-hidden="true">
						<strong>{day.totalSeconds > 0 ? day.text : 'No activity'}</strong>
						{formatDay(day.date)}
					</span>
					<div className={styles.ActivityChart__track}>
						{day.totalSeconds > 0 ? (
							<motion.div
								className={styles.ActivityChart__bar}
								style={{ height: `${(day.totalSeconds / max) * 100}%` }}
								initial={{ scaleY: 0 }}
								animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
								transition={{
									duration: 0.7,
									delay: index * 0.06,
									ease: [0.16, 1, 0.3, 1],
								}}
							/>
						) : (
							<span className={styles.ActivityChart__empty} />
						)}
					</div>
					<span className={styles.ActivityChart__label}>
						{weekdayLetter(day.date)}
					</span>
				</div>
			))}
		</div>
	);
};

export default ActivityChart;
