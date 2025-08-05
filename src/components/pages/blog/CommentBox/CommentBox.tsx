'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { CommentModal } from 'components/pages';
import type { CommentFormData } from 'types/comment';

import styles from './CommentBox.module.scss';

interface CommentBoxProps {
	onSubmit: (data: CommentFormData) => Promise<void>;
	replyingTo?: string;
	replyingToId?: string;
	onCancelReply?: () => void;
	placeholder?: string;
	className?: string;
}

/**
 * CommentBox component for displaying a simple comment input that opens a modal
 */
const CommentBox: FC<CommentBoxProps> = ({
	onSubmit,
	replyingTo,
	replyingToId,
	onCancelReply,
	placeholder = 'Share your thoughts...',
	className = '',
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleBoxClick = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handleModalSubmit = async (data: CommentFormData) => {
		await onSubmit(data);
		setIsModalOpen(false);
	};

	return (
		<>
			<motion.div
				className={`${styles.commentBox} ${className}`}
				onClick={handleBoxClick}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				transition={{ duration: 0.2 }}
			>
				<div className={styles.commentBox__content}>
					<div className={styles.commentBox__avatar}>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<circle
								cx="12"
								cy="7"
								r="4"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<div className={styles.commentBox__input}>
						<span className={styles.commentBox__placeholder}>
							{replyingTo ? `Reply to ${replyingTo}...` : placeholder}
						</span>
					</div>
					<div className={styles.commentBox__icon}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</motion.div>
			{typeof window !== 'undefined' &&
				createPortal(
					<CommentModal
						isOpen={isModalOpen}
						onClose={handleModalClose}
						onSubmit={handleModalSubmit}
						replyingTo={replyingTo}
						replyingToId={replyingToId}
						onCancelReply={onCancelReply}
						title={replyingTo ? `Reply to ${replyingTo}` : 'Add Comment'}
					/>,
					document.body
				)}
		</>
	);
};

export default CommentBox;
