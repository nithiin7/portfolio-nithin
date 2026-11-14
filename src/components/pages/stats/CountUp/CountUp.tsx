'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import type { FC, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import { formatCompactNumber } from 'helpers/format';
import { duration, ease } from 'styles/tokens';

interface CountUpProps {
	value: number;
	decimals?: number;
	compact?: boolean;
	suffix?: string;
	className?: string;
}

const CountUp: FC<CountUpProps> = ({
	value,
	decimals = 0,
	compact = false,
	suffix = '',
	className = '',
}): ReactElement => {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-40px' });
	const reduceMotion = useReducedMotion();

	const [current, setCurrent] = useState(value);

	useEffect(() => {
		if (!isInView || reduceMotion) return undefined;

		const controls = animate(0, value, {
			duration: duration.slow,
			ease: [...ease],
			onUpdate: setCurrent,
		});

		return () => controls.stop();
	}, [isInView, reduceMotion, value]);

	const factor = 10 ** decimals;
	const shown = Math.round(current * factor) / factor;
	const formatted = compact
		? formatCompactNumber(shown)
		: shown.toLocaleString('en-US', {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});

	return (
		<span ref={ref} className={className}>
			{formatted}
			{suffix}
		</span>
	);
};

export default CountUp;
