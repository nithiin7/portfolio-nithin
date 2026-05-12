'use client';

import type { FC } from 'react';
import { Toaster } from 'sonner';

import styles from './Toast.module.scss';

const TOAST_CONFIG = {
	position: 'top-right',
	richColors: true,
	theme: 'dark',
	duration: 4000,
	closeButton: true,
	toastOptions: {
		classNames: {
			toast: styles.Toast,
			title: styles.Toast__title,
			description: styles.Toast__description,
		},
	},
} as const;

const Toast: FC = () => <Toaster {...TOAST_CONFIG} />;

export default Toast;
