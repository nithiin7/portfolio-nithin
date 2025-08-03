'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';

import styles from './Subscribe.module.scss';

interface SubscribeProps {
	className?: string;
	delay?: number;
}

/**
 * Reusable Subscribe component for newsletter signup
 */
const Subscribe: FC<SubscribeProps> = ({ className = '', delay = 0 }) => {
	return (
		<motion.section
			className={`${styles.subscribe} ${className}`}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
		>
			<div className={styles.subscribe__content}>
				<h2 className={styles.subscribe__title}>STAY UPDATED</h2>
				<p className={styles.subscribe__text}>
					Get notified when I publish new articles about design, development,
					and creative insights.
				</p>
				<div className={styles.subscribe__form}>
					<input
						type="email"
						placeholder="Enter your email"
						className={styles.subscribe__input}
					/>
					<button className={styles.subscribe__button}>Subscribe</button>
				</div>
			</div>
		</motion.section>
	);
};

export default Subscribe;
