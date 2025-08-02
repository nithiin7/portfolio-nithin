'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';

import styles from './ColorMaskButton.module.scss';

interface ColorMaskButtonProps {
	className?: string;
	text?: string;
	href?: string;
	variant?: 'default' | 'menu';
}

/**
 * A creative button component with slide-up animation and text change on hover.
 * Features smooth text transitions and arrow movement similar to creative portfolio websites.
 *
 * @param {ColorMaskButtonProps} props - The props for the component.
 * @returns {JSX.Element} The rendered button component.
 */
const ColorMaskButton: FC<ColorMaskButtonProps> = ({
	className = '',
	text = 'Book a Call',
	href = '/contact',
	variant = 'default',
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.a
			className={[
				styles.ColorMaskButton,
				styles[`ColorMaskButton--${variant}`],
				className,
			].join(' ')}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
			href={href}
		>
			<div className={styles.ColorMaskButton__content}>
				<motion.div
					className={styles.ColorMaskButton__text}
					animate={{
						y: isHovered ? -30 : 0,
						opacity: isHovered ? 0 : 1,
					}}
					transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
				>
					{text}
				</motion.div>
				<motion.div
					className={[
						styles.ColorMaskButton__text,
						styles.ColorMaskButton__textDuplicate,
					].join(' ')}
					animate={{
						y: isHovered ? 0 : 30,
						opacity: isHovered ? 1 : 0,
					}}
					transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
				>
					{text}
				</motion.div>
			</div>
			<motion.div
				className={styles.ColorMaskButton__arrow}
				animate={{
					x: isHovered ? 6 : 0,
					rotate: isHovered ? 0 : 0,
				}}
				transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8 1L15 8L8 15M15 8H1"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</motion.div>
			<motion.div
				className={styles.ColorMaskButton__background}
				animate={{
					scale: isHovered ? 1 : 0,
					opacity: isHovered ? 1 : 0,
				}}
				transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
			/>
		</motion.a>
	);
};

ColorMaskButton.displayName = 'ColorMaskButton';

export default ColorMaskButton;
