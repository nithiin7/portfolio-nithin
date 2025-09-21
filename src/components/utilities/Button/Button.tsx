'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';

import styles from './Button.module.scss';

interface ButtonProps {
	text?: string;
	className?: string;
	variant?: string;
	onClick?: () => void;
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
	onClick,
}) => {
	return (
		<button
			className={[styles.Button, styles[`Button__${variant}`], className].join(
				' '
			)}
			type="button"
			aria-label="submit"
			onClick={onClick}
		>
			<motion.div className={styles.Button__slider}>
				<div className={styles.Button__el}>
					<div className={styles.Button__PerspectiveText}>
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
