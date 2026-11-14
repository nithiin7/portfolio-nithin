'use client';

import type { CSSProperties, FC } from 'react';
import { Toaster } from 'sonner';

import { useTheme } from 'contexts/ThemeContext';

import styles from './Toast.module.scss';

const toastVars = {
	'--normal-bg': 'var(--inverse-bg)',
	'--normal-text': 'var(--inverse-fg)',
	'--normal-border': 'var(--inverse-bg)',
	'--border-radius': 'var(--radius-1)',
} as CSSProperties;

/** Toast container styled to the theme. */
const Toast: FC = () => {
	const { theme } = useTheme();

	return (
		<Toaster
			position="bottom-center"
			theme={theme === 'dark' ? 'light' : 'dark'}
			duration={4000}
			style={toastVars}
			toastOptions={{
				classNames: {
					toast: styles.Toast,
					title: styles.Toast__title,
					description: styles.Toast__description,
				},
			}}
		/>
	);
};

export default Toast;
