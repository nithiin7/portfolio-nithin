'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useInView } from 'react-intersection-observer';

import styles from './MaskText.module.scss';

interface MaskTextProps {
	className?: string;
	phrases: string[];
	delay?: number;
	charVariant?: 'slide' | 'flip';
}

const charAnimationByVariant = {
	slide: {
		hidden: { y: '100%', opacity: 0 },
		visible: { y: '0%', opacity: 1 },
	},
	flip: {
		hidden: { y: '100%', opacity: 0, rotateX: -90 },
		visible: { y: '0%', opacity: 1, rotateX: 0 },
	},
} as const;

/**
 * MaskText component that displays phrases with a mask effect,
 * animating them into view as they scroll into view, splitting words into characters.
 *
 * @param {MaskTextProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered MaskText component.
 */
const MaskText: FC<MaskTextProps> = ({
	className = '',
	phrases = [],
	delay = 0,
	charVariant = 'slide',
}) => {
	const { ref, inView } = useInView({
		threshold: 0.75,
		triggerOnce: true,
	});

	const { hidden, visible } = charAnimationByVariant[charVariant];

	return (
		<div className={`${styles.MaskText} ${className}`} ref={ref}>
			{phrases.map((phrase, phraseIndex) => (
				<div className={styles.MaskText__lineMask} key={phraseIndex}>
					{phrase.split(' ').map((word, wordIndex) => (
						<span key={wordIndex} style={{ whiteSpace: 'pre' }}>
							{word.split('').map((char, charIndex) => (
								<motion.span
									key={charIndex}
									initial={hidden}
									animate={inView ? visible : hidden}
									transition={{
										duration: 0.4,
										delay: delay + wordIndex * 0.2 + charIndex * 0.03,
										ease: [0.33, 1, 0.68, 1],
									}}
									style={{
										display: 'inline-block',
										transformPerspective:
											charVariant === 'flip' ? 400 : undefined,
									}}
								>
									{char}
								</motion.span>
							))}{' '}
						</span>
					))}
				</div>
			))}
		</div>
	);
};

export default MaskText;
