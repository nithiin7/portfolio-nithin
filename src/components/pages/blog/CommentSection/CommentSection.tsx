'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { CommentBox, CommentCard } from 'components/pages';
import type { Comment, CommentFormData } from 'types/comment';

import styles from './CommentSection.module.scss';

interface CommentSectionProps {
	postId: string;
	postSlug: string;
	className?: string;
}

/**
 * CommentSection component for managing and displaying blog post comments
 */
const CommentSection: FC<CommentSectionProps> = ({
	postId,
	postSlug: _postSlug,
	className = '',
}) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState(false);

	useEffect(() => {
		const loadComments = async () => {
			try {
				const response = await fetch(`/api/comments?postId=${postId}`);
				if (response.ok) {
					const data = await response.json();
					setComments(data.comments || []);
				} else {
					setFetchError(true);
				}
			} catch {
				setFetchError(true);
			} finally {
				setIsLoading(false);
			}
		};

		loadComments();
	}, [postId]);

	const handleSubmitComment = async (data: CommentFormData) => {
		try {
			const response = await fetch('/api/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postId,
					authorName: data.authorName,
					authorEmail: data.authorEmail,
					content: data.content,
					parentId: data.parentId,
					recaptchaToken: data.recaptchaToken,
				}),
			});

			if (response.ok) {
				const result = await response.json();
				const newComment = result.comment;

				if (result.pending) {
					toast.info('Comment submitted', {
						description:
							'Your comment is pending review and will appear once approved.',
					});
				} else if (data.parentId) {
					const updatedComments = comments.map((comment) => {
						if (comment.id === data.parentId) {
							return {
								...comment,
								replies: [...(comment.replies || []), newComment],
							};
						}
						return comment;
					});
					setComments(updatedComments);
				} else {
					setComments((prev) => [...prev, newComment]);
				}
			} else {
				toast.error('Failed to submit comment', {
					description: 'Please try again later.',
				});
			}
		} catch {
			toast.error('Failed to submit comment', {
				description: 'Please try again later.',
			});
		}
	};

	const topLevelComments = comments.filter((comment) => !comment.parentId);

	if (isLoading) {
		return (
			<motion.div
				className={`${styles.CommentSection} ${className}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.CommentSection__loading}>
					<div className={styles.CommentSection__spinner} />
					<p>Loading comments...</p>
				</div>
			</motion.div>
		);
	}

	if (fetchError) {
		return (
			<motion.div
				className={`${styles.CommentSection} ${className}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.CommentSection__loading}>
					<p>Comments are currently unavailable. Please try again later.</p>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.section
			className={`${styles.CommentSection} ${className}`}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
		>
			<motion.div
				className={styles.CommentSection__header}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<h2 className={styles.CommentSection__title}>
					Comments ({topLevelComments.length})
				</h2>
				<p className={styles.CommentSection__subtitle}>
					Share your thoughts and join the conversation
				</p>
			</motion.div>
			<CommentBox
				onSubmit={handleSubmitComment}
				placeholder="Share your thoughts on this article..."
				className={styles.CommentSection__form}
			/>
			<motion.div
				className={styles.CommentSection__list}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				{topLevelComments.length === 0 ? (
					<motion.div
						className={styles.CommentSection__empty}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<div className={styles.CommentSection__emptyIcon}>💬</div>
						<h3 className={styles.CommentSection__emptyTitle}>
							No comments yet
						</h3>
						<p className={styles.CommentSection__emptyMessage}>
							Be the first to share your thoughts on this article!
						</p>
					</motion.div>
				) : (
					topLevelComments.map((comment, index) => (
						<motion.div
							key={comment.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: 0.6 + index * 0.1,
								ease: [0.33, 1, 0.68, 1],
							}}
						>
							<CommentCard
								comment={comment}
								onSubmit={handleSubmitComment}
								className={styles.CommentSection__comment}
							/>
						</motion.div>
					))
				)}
			</motion.div>
		</motion.section>
	);
};

export default CommentSection;
