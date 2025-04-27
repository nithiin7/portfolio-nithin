'use client';
import React, { FC } from 'react';
import { motion } from 'motion/react';

import styles from './Button.module.scss';

interface ButtonProps {
	text?: string;
	className?: string;
	variant?: string;
}

/**
 * A button component that supports animations and different styles.
 * @param {ButtonProps} props - The props for the component.
 * @returns {JSX.Element} The rendered button component.
 */
const Button: FC<ButtonProps> = ({
	text = '',
	className = '',
	variant = '',
}) => {
	return (
		<button
			className={[styles.button, styles[`button__${variant}`], className].join(
				' '
			)}
			type="submit"
			aria-label="submit"
		>
			<motion.div className={styles.button__slider}>
				<div className={styles.button__el}>
					<div className={styles.button__PerspectiveText}>
						<p>{text}</p>
						<p>{text}</p>
					</div>
				</div>
			</motion.div>
		</button>
	);
};

Button.displayName = 'Button';

export default Button;
