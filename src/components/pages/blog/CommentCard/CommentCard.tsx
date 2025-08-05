'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';

import { CommentBox } from 'components/pages';
import type { Comment, CommentFormData } from 'types/comment';

import styles from './CommentCard.module.scss';

interface CommentCardProps {
	comment: Comment;
	onSubmit?: (data: CommentFormData) => Promise<void>;
	replyingTo?: string;
	className?: string;
}

/**
 * CommentCard component for displaying individual comments with animations
 */
const CommentCard: FC<CommentCardProps> = ({
	comment,
	onSubmit,
	replyingTo,
	className = '',
}) => {
	const [isExpanded, setIsExpanded] = useState(true);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) {
			return 'Just now';
		} else if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		} else {
			const diffInDays = Math.floor(diffInHours / 24);
			if (diffInDays < 7) {
				return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
			} else {
				return date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				});
			}
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<motion.div
			className={`${styles.commentCard} ${className}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
			layout
		>
			<div className={styles.commentCard__header}>
				<div className={styles.commentCard__avatar}>
					<span className={styles.commentCard__initials}>
						{getInitials(comment.authorName)}
					</span>
				</div>
				<div className={styles.commentCard__meta}>
					<h4 className={styles.commentCard__author}>{comment.authorName}</h4>
					<span className={styles.commentCard__date}>
						{formatDate(comment.createdAt)}
					</span>
				</div>
			</div>
			<div className={styles.commentCard__content}>
				{replyingTo && (
					<div className={styles.commentCard__replyTo}>
						Replying to <strong>{replyingTo}</strong>
					</div>
				)}
				<p className={styles.commentCard__text}>{comment.content}</p>
			</div>
			<div className={styles.commentCard__actions}>
				{onSubmit && (
					<CommentBox
						onSubmit={onSubmit}
						replyingTo={comment.authorName}
						replyingToId={comment.id}
						placeholder={`Reply to ${comment.authorName}...`}
						className={styles.commentCard__replyBox}
					/>
				)}
				{comment.replies && comment.replies.length > 0 && (
					<motion.button
						className={styles.commentCard__toggleReplies}
						onClick={() => setIsExpanded(!isExpanded)}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2 }}
					>
						{isExpanded ? 'Hide' : 'Show'} {comment.replies.length} repl
						{comment.replies.length === 1 ? 'y' : 'ies'}
					</motion.button>
				)}
			</div>
			{comment.replies && comment.replies.length > 0 && (
				<motion.div
					className={styles.commentCard__replies}
					initial={false}
					animate={{
						height: isExpanded ? 'auto' : 0,
						opacity: isExpanded ? 1 : 0,
					}}
					transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
				>
					{comment.replies.map((reply) => (
						<CommentCard
							key={reply.id}
							comment={reply}
							onSubmit={onSubmit}
							replyingTo={comment.authorName}
							className={styles.commentCard__reply}
						/>
					))}
				</motion.div>
			)}
		</motion.div>
	);
};

export default CommentCard;
