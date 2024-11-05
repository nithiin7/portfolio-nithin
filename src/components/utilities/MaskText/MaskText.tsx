'use client';
import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import styles from './MaskText.module.scss';

interface MaskTextProps {
	className?: string;
	variant?: string;
	phrases: string[];
}

/**
 * MaskText component that displays phrases with a mask effect,
 * animating them into view as they scroll into view.
 *
 * @param {MaskTextProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered MaskText component.
 */
const MaskText: FC<MaskTextProps> = ({
	className = '',
	variant = '',
	phrases = [],
}) => {
	const animation: Variants = {
		initial: { y: '100%' },
		enter: {
			y: '0',
			transition: {
				duration: 0.75,
				ease: [0.33, 1, 0.68, 1],
			},
		},
	};

	const { ref, inView } = useInView({
		threshold: 0.75,
		triggerOnce: true,
	});

	return (
		<div
			className={`${styles.MaskText} ${
				styles[`MaskText__${variant}`]
			} ${className}`}
			ref={ref}
		>
			<motion.div
				variants={{
					enter: {
						transition: { staggerChildren: 0.025 },
					},
				}}
				initial="initial"
				animate={inView ? 'enter' : ''}
			>
				{phrases.map((phrase, phraseIndex) => (
					<motion.div className={styles.MaskText__lineMask} key={phraseIndex}>
						{phrase.split(' ').map((word, wordIndex) => (
							<motion.span key={wordIndex} variants={animation}>
								{word + ' '}
							</motion.span>
						))}
					</motion.div>
				))}
			</motion.div>
		</div>
	);
};

export default MaskText;
