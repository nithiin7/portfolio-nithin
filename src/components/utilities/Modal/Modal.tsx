'use client';
import { motion, AnimatePresence } from 'motion/react';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';

import styles from './Modal.module.scss';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	className?: string;
}

/**
 * Generic Modal component for displaying content in a modal overlay
 */
const Modal: FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	className,
}) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleEscapeKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleEscapeKey);
			return () => document.removeEventListener('keydown', handleEscapeKey);
		}
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className={`${styles.modal} ${className || ''}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
					onClick={handleBackdropClick}
				>
					<motion.div
						className={styles.modal__content}
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
					>
						{title && (
							<div className={styles.modal__header}>
								<h2 className={styles.modal__title}>{title}</h2>
								<motion.button
									className={styles.modal__close}
									onClick={onClose}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									transition={{ duration: 0.2 }}
									aria-label="Close modal"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M18 6L6 18M6 6L18 18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</motion.button>
							</div>
						)}
						<div className={styles.modal__body}>{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
