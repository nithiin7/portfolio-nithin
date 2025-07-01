'use client';
import { motion } from 'motion/react';
import React from 'react';

import { useTheme } from 'contexts/ThemeContext';

import styles from './ThemeToggle.module.scss';

export interface ThemeToggleProps {
	className?: string;
}

/**
 * ThemeToggle component that provides a beautiful animated toggle between light and dark modes.
 * Features smooth animations and integrates seamlessly with the existing design system.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @returns {React.JSX.Element} The rendered ThemeToggle component.
 */
const ThemeToggle = ({
	className = '',
}: ThemeToggleProps): React.JSX.Element => {
	const { theme, toggleTheme } = useTheme();

	return (
		<motion.button
			className={`${styles['theme-toggle']} ${className}`}
			onClick={toggleTheme}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ duration: 0.2, ease: 'easeInOut' }}
			aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
		>
			<motion.div
				className={styles['theme-toggle__container']}
				animate={{ rotate: theme === 'dark' ? 180 : 0 }}
				transition={{ duration: 0.5, ease: 'easeInOut' }}
			>
				<motion.svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={styles['theme-toggle__sun']}
					animate={{
						opacity: theme === 'light' ? 1 : 0,
						scale: theme === 'light' ? 1 : 0.5,
						rotate: theme === 'light' ? 0 : 90,
					}}
					transition={{ duration: 0.4, ease: 'easeInOut' }}
				>
					<circle cx="12" cy="12" r="4" fill="currentColor" />
					<path
						d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</motion.svg>
				<motion.svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={styles['theme-toggle__moon']}
					animate={{
						opacity: theme === 'dark' ? 1 : 0,
						scale: theme === 'dark' ? 1 : 0.5,
						rotate: theme === 'dark' ? 0 : -90,
					}}
					transition={{ duration: 0.4, ease: 'easeInOut' }}
				>
					<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" />
				</motion.svg>
			</motion.div>
			<motion.div
				className={styles['theme-toggle__background']}
				animate={{
					scale: theme === 'light' ? 1.2 : 1.0,
					opacity: 0.8,
				}}
				transition={{ duration: 0.4, ease: 'easeInOut' }}
			/>
		</motion.button>
	);
};

export default ThemeToggle;
