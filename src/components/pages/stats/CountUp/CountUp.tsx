'use client';

import { animate, useInView } from 'motion/react';
import type { FC, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import { formatCompactNumber } from 'helpers';

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

	const [current, setCurrent] = useState(value);

	useEffect(() => {
		if (!isInView) return undefined;

		const controls = animate(0, value, {
			duration: 1.4,
			ease: [0.16, 1, 0.3, 1],
			onUpdate: setCurrent,
		});

		return () => controls.stop();
	}, [isInView, value]);

	const formatted = compact
		? formatCompactNumber(current)
		: current.toLocaleString('en-US', {
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
