'use client';
import React from 'react';
import { motion } from 'framer-motion';

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
const Button: React.FC<ButtonProps> = ({
	text = '',
	className = '',
	variant = '',
}) => {
	return (
		<button
			className={[styles.Button, styles[`button__${variant}`], className].join(
				' '
			)}
			type="submit"
			aria-label="submit"
		>
			<motion.div className="button__slider">
				<div className="button__el">
					<div className="button__PerspectiveText">
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
