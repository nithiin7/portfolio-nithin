'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useCallback } from 'react';

import styles from './FloatingChat.module.scss';

interface FloatingChatProps {
	chatbotUrl: string;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ chatbotUrl }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleChat = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	return (
		<>
			<motion.button
				className={styles.floatingButton}
				onClick={toggleChat}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.98 }}
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					duration: 0.2,
					ease: [0.4, 0, 0.2, 1],
					type: 'spring',
					stiffness: 300,
					damping: 25,
				}}
				aria-label="Open chat"
			>
				<motion.div
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{
						duration: 0.15,
						ease: [0.4, 0, 0.2, 1],
					}}
					className={styles.icon}
				>
					{isOpen ? (
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
					) : (
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</motion.div>
			</motion.button>
			<AnimatePresence mode="wait">
				{isOpen && (
					<motion.div
						className={styles.chatWindow}
						initial={{ opacity: 0, scale: 0.9, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 10 }}
						transition={{
							duration: 0.2,
							ease: [0.4, 0, 0.2, 1],
							type: 'spring',
							stiffness: 300,
							damping: 25,
						}}
					>
						<motion.div
							className={styles.chatHeader}
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: 0.05,
								duration: 0.15,
								ease: [0.4, 0, 0.2, 1],
							}}
						>
							<h3>Chat with Nithin</h3>
							<button
								onClick={toggleChat}
								className={styles.closeButton}
								aria-label="Close chat"
							>
								<svg
									width="16"
									height="16"
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
							</button>
						</motion.div>
						<motion.div
							className={styles.chatContent}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								delay: 0.1,
								duration: 0.2,
								ease: [0.4, 0, 0.2, 1],
							}}
						>
							<iframe
								src={chatbotUrl}
								frameBorder="0"
								width="100%"
								height="100%"
								title="Chat with Nithin"
								loading="lazy"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default FloatingChat;
