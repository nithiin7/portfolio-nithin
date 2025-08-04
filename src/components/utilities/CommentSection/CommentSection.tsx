'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';

import { CommentCard, CommentBox } from 'components/utilities';
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

	useEffect(() => {
		const loadComments = async () => {
			try {
				const response = await fetch(`/api/comments?postId=${postId}`);
				if (response.ok) {
					const data = await response.json();
					setComments(data.comments || []);
				} else {
					console.error('Error loading comments:', response.statusText);
				}
			} catch (error) {
				console.error('Error loading comments:', error);
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
				}),
			});

			if (response.ok) {
				const result = await response.json();
				const newComment = result.comment;

				if (data.parentId) {
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
				const errorData = await response.json();
				console.error('Error submitting comment:', errorData.error);
			}
		} catch (error) {
			console.error('Error submitting comment:', error);
		}
	};

	const topLevelComments = comments.filter((comment) => !comment.parentId);

	if (isLoading) {
		return (
			<motion.div
				className={`${styles.commentSection} ${className}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.commentSection__loading}>
					<div className={styles.commentSection__spinner} />
					<p>Loading comments...</p>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.section
			className={`${styles.commentSection} ${className}`}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
		>
			<motion.div
				className={styles.commentSection__header}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<h2 className={styles.commentSection__title}>
					Comments ({topLevelComments.length})
				</h2>
				<p className={styles.commentSection__subtitle}>
					Share your thoughts and join the conversation
				</p>
			</motion.div>
			<CommentBox
				onSubmit={handleSubmitComment}
				placeholder="Share your thoughts on this article..."
				className={styles.commentSection__form}
			/>
			<motion.div
				className={styles.commentSection__list}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				{topLevelComments.length === 0 ? (
					<motion.div
						className={styles.commentSection__empty}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						<div className={styles.commentSection__emptyIcon}>💬</div>
						<h3 className={styles.commentSection__emptyTitle}>
							No comments yet
						</h3>
						<p className={styles.commentSection__emptyMessage}>
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
								className={styles.commentSection__comment}
							/>
						</motion.div>
					))
				)}
			</motion.div>
		</motion.section>
	);
};

export default CommentSection;
