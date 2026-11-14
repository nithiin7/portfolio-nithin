'use client';
import { useState, type FC, type ReactElement } from 'react';

import CommentForm from 'components/pages/blog/CommentForm/CommentForm';
import type { Comment, CommentFormData } from 'types/comment';

import styles from './CommentCard.module.scss';

interface CommentCardProps {
	comment: Comment;
	onSubmit: (data: CommentFormData) => Promise<boolean>;
}

const relativeTime = (iso: string): string => {
	const date = new Date(iso);
	const hours = Math.floor((Date.now() - date.getTime()) / 3_600_000);
	if (hours < 1) return 'Just now';
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	return date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

const CommentCard: FC<CommentCardProps> = ({
	comment,
	onSubmit,
}): ReactElement => {
	const [replying, setReplying] = useState(false);
	const replies = comment.replies ?? [];

	const submitReply = async (data: CommentFormData): Promise<boolean> => {
		const ok = await onSubmit(data);
		if (ok) setReplying(false);
		return ok;
	};

	return (
		<article
			className={styles.CommentCard}
			aria-label={`Comment by ${comment.authorName}`}
		>
			<header className={styles.CommentCard__meta}>
				<span className={styles.CommentCard__author}>{comment.authorName}</span>
				<time className={styles.CommentCard__date} dateTime={comment.createdAt}>
					{relativeTime(comment.createdAt)}
				</time>
			</header>

			<p className={styles.CommentCard__text}>{comment.content}</p>

			{!comment.parentId && (
				<button
					type="button"
					className={styles.CommentCard__reply}
					aria-expanded={replying}
					onClick={() => setReplying((open) => !open)}
				>
					{replying ? 'Close reply' : 'Reply'}
				</button>
			)}

			{replying && (
				<CommentForm
					className={styles.CommentCard__form}
					onSubmit={submitReply}
					parentId={comment.id}
					replyingTo={comment.authorName}
					onCancel={() => setReplying(false)}
				/>
			)}

			{replies.length > 0 && (
				<ol className={styles.CommentCard__replies}>
					{replies.map((reply) => (
						<li key={reply.id}>
							<CommentCard comment={reply} onSubmit={onSubmit} />
						</li>
					))}
				</ol>
			)}
		</article>
	);
};

export default CommentCard;
