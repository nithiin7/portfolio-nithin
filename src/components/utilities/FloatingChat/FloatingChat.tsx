'use client';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { FC } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { duration, ease } from 'styles/tokens';

import styles from './FloatingChat.module.scss';

interface FloatingChatProps {
	chatbotUrl: string;
}

// Wipes up from the launcher's edge, same language as Modal and RevealImage.
const windowVariants: Variants = {
	hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: '1rem' },
	visible: {
		clipPath: 'inset(0% 0% 0% 0%)',
		y: 0,
		transition: { duration: duration.base, ease },
	},
	exit: {
		clipPath: 'inset(100% 0% 0% 0%)',
		y: '1rem',
		transition: { duration: duration.fast, ease },
	},
};

const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
};

const ChatIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M4 5h16v11H9l-5 4V5Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="miter"
		/>
		<path d="M8 10.5h8" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

const CloseIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
	</svg>
);

/**
 * Launcher + panel for the Hugging Face chatbot iframe.
 * The iframe mounts only while the panel is open, so it never costs page load.
 */
const FloatingChat: FC<FloatingChatProps> = ({ chatbotUrl }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const launcherRef = useRef<HTMLButtonElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const panelId = useId();
	const prefersReducedMotion = useReducedMotion();

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => {
		setIsOpen(false);
		setIsLoaded(false);
		launcherRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		closeRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, close]);

	return (
		<>
			<div className={styles.FloatingChat}>
				<button
					ref={launcherRef}
					type="button"
					className={`${styles.FloatingChat__launcher} ${
						isOpen ? styles['FloatingChat__launcher--open'] : ''
					}`}
					onClick={isOpen ? close : open}
					aria-expanded={isOpen}
					aria-controls={panelId}
					aria-label={isOpen ? 'Close chat' : 'Chat with Nithin’s AI assistant'}
				>
					<span className={styles.FloatingChat__label} aria-hidden="true">
						Ask my AI
					</span>
					<span className={styles.FloatingChat__icon}>
						<span className={styles['FloatingChat__icon-chat']}>
							<ChatIcon />
						</span>
						<span className={styles['FloatingChat__icon-close']}>
							<CloseIcon />
						</span>
					</span>
					<span className={styles.FloatingChat__dot} aria-hidden="true" />
				</button>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.section
						id={panelId}
						className={styles.FloatingChat__window}
						role="dialog"
						aria-label="Chat with Nithin"
						variants={prefersReducedMotion ? fadeVariants : windowVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						data-lenis-prevent
					>
						<header className={styles.FloatingChat__header}>
							<div className={styles.FloatingChat__heading}>
								<p className={styles.FloatingChat__eyebrow}>
									<span className={styles.FloatingChat__status} />
									AI assistant
								</p>
								<h2 className={styles.FloatingChat__title}>
									Ask about my <em>work</em>
								</h2>
							</div>
							<button
								ref={closeRef}
								type="button"
								className={styles.FloatingChat__close}
								onClick={close}
								aria-label="Close chat"
							>
								<CloseIcon />
							</button>
						</header>

						<div className={styles.FloatingChat__body}>
							{!isLoaded && (
								<p className={styles.FloatingChat__loading} role="status">
									Loading assistant<span aria-hidden="true">_</span>
								</p>
							)}
							<iframe
								src={chatbotUrl}
								title="Chat with Nithin’s AI assistant"
								className={isLoaded ? styles['FloatingChat__frame--ready'] : ''}
								onLoad={() => setIsLoaded(true)}
							/>
						</div>

						<footer className={styles.FloatingChat__footer}>
							<span>Answers from my resume &amp; projects</span>
							<span>
								<kbd>Esc</kbd> close
							</span>
						</footer>
					</motion.section>
				)}
			</AnimatePresence>
		</>
	);
};

export default FloatingChat;
