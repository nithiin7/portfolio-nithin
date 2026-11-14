'use client';
import type { ReactElement } from 'react';
import { useMemo, useSyncExternalStore } from 'react';

import styles from './LocalClock.module.scss';

export interface LocalClockProps {
	timeZone: string;
	zoneLabel?: string;
	showSeconds?: boolean;
	className?: string;
}

const subscribe = (onTick: () => void): (() => void) => {
	const id = window.setInterval(onTick, 1000);
	return () => window.clearInterval(id);
};

const getSecond = (): number => Math.floor(Date.now() / 1000);

const getServerSecond = (): null => null;

/** Live clock for a time zone. */
const LocalClock = ({
	timeZone,
	zoneLabel,
	showSeconds = true,
	className,
}: LocalClockProps): ReactElement => {
	const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);

	const formatter = useMemo(
		() =>
			new Intl.DateTimeFormat('en-GB', {
				timeZone,
				hour: '2-digit',
				minute: '2-digit',
				second: showSeconds ? '2-digit' : undefined,
				hourCycle: 'h23',
			}),
		[timeZone, showSeconds]
	);

	const placeholder = showSeconds ? '--:--:--' : '--:--';
	const date = second === null ? null : new Date(second * 1000);

	return (
		<span className={[styles.LocalClock, className].filter(Boolean).join(' ')}>
			<time dateTime={date?.toISOString()}>
				{date ? formatter.format(date) : placeholder}
			</time>
			{zoneLabel && <span> {zoneLabel}</span>}
		</span>
	);
};

export default LocalClock;
