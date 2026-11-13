'use client';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { FC, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import CloseIcon from 'assets/icons/CloseIcon';
import { fadeVariants, overlayVariants } from 'helpers/animations';
import { useFocusTrap } from 'hooks/useKeyboardNavigation';
import { duration, ease } from 'styles/tokens';

import styles from './Modal.module.scss';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	/** Small mono label shown before the title, e.g. "03 / 14" */
	eyebrow?: string;
	children: ReactNode;
	className?: string;
}

// The panel wipes open from its bottom edge, matching RevealImage.
const panel: Variants = {
	hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: '1.5rem' },
	visible: {
		clipPath: 'inset(0% 0% 0% 0%)',
		y: 0,
		transition: { duration: duration.base, ease },
	},
	exit: {
		clipPath: 'inset(0% 0% 100% 0%)',
		y: '-0.75rem',
		transition: { duration: duration.fast, ease },
	},
};

/**
 * Editorial modal: hairline frame, mono header, clip-path reveal.
 * Renders as a bottom sheet below the md breakpoint.
 */
const Modal: FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	eyebrow,
	children,
	className,
}) => {
	const contentRef = useFocusTrap(isOpen);
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			previousFocusRef.current = document.activeElement as HTMLElement | null;
			contentRef.current?.focus();
		} else {
			previousFocusRef.current?.focus();
			previousFocusRef.current = null;
		}
	}, [isOpen, contentRef]);

	useEffect(() => {
		if (!isOpen) return;

		const handleEscapeKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleEscapeKey);
		return () => document.removeEventListener('keydown', handleEscapeKey);
	}, [isOpen, onClose]);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className={`${styles.Modal} ${className ?? ''}`}
					variants={overlayVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					onClick={handleBackdropClick}
					data-lenis-prevent
				>
					<motion.div
						ref={contentRef}
						className={styles.Modal__content}
						role="dialog"
						aria-modal="true"
						aria-label={title || 'Dialog'}
						tabIndex={-1}
						variants={prefersReducedMotion ? fadeVariants : panel}
					>
						<div className={styles.Modal__header}>
							<p className={styles.Modal__title}>
								{eyebrow && (
									<span className={styles.Modal__eyebrow}>{eyebrow}</span>
								)}
								{title}
							</p>
							<button
								type="button"
								className={styles.Modal__close}
								onClick={onClose}
								aria-label="Close dialog"
							>
								<span className={styles['Modal__close-key']} aria-hidden="true">
									Esc
								</span>
								<span className={styles['Modal__close-icon']}>
									<CloseIcon />
								</span>
							</button>
						</div>
						<div className={styles.Modal__body}>{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
