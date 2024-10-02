'use client';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import styles from './MaskText.module.scss';

const MaskText = ({ className = '', variant = '', phrases = [] }) => {
	const animation = {
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
					<motion.div className="MaskText__lineMask" key={phraseIndex}>
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

MaskText.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	phrases: PropTypes.array,
};

export default MaskText;
