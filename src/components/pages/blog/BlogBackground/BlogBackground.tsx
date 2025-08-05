'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';

import styles from './BlogBackground.module.scss';

/**
 * BlogBackground component with animated floating elements
 */
const BlogBackground: FC = () => {
	return (
		<div className={styles.BlogBackground}>
			<motion.div
				className={styles.BlogBackground__circle1}
				animate={{
					y: [0, -20, 0],
					x: [0, 10, 0],
					rotate: [0, 180, 360],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				className={styles.BlogBackground__circle2}
				animate={{
					y: [0, 15, 0],
					x: [0, -15, 0],
					rotate: [0, -180, -360],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 2,
				}}
			/>
			<motion.div
				className={styles.BlogBackground__circle3}
				animate={{
					y: [0, -25, 0],
					x: [0, 20, 0],
					rotate: [0, 90, 180],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 4,
				}}
			/>
			<motion.div
				className={styles.BlogBackground__square1}
				animate={{
					y: [0, 30, 0],
					x: [0, -25, 0],
					rotate: [0, 45, 90],
				}}
				transition={{
					duration: 15,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 1,
				}}
			/>
			<motion.div
				className={styles.BlogBackground__square2}
				animate={{
					y: [0, -35, 0],
					x: [0, 15, 0],
					rotate: [0, -45, -90],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 3,
				}}
			/>
			<div className={styles.BlogBackground__gradient} />
		</div>
	);
};

export default BlogBackground;
