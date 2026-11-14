'use client';
import { useEffect, useState, type FC, type ReactElement } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { toast } from 'sonner';

import CommentCard from 'components/pages/blog/CommentCard/CommentCard';
import CommentForm from 'components/pages/blog/CommentForm/CommentForm';
import { clientEnv } from 'helpers/env';
import type { Comment, CommentFormData } from 'types/comment';

import styles from './CommentSection.module.scss';

interface CommentSectionProps {
	postId: string;
	className?: string;
}

type LoadState = 'loading' | 'ready' | 'error';

const countAll = (comments: Comment[]): number =>
	comments.reduce((sum, c) => sum + 1 + countAll(c.replies ?? []), 0);

const CommentSection: FC<CommentSectionProps> = ({
	postId,
	className,
}): ReactElement => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [state, setState] = useState<LoadState>('loading');

	useEffect(() => {
		let cancelled = false;
		fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
			.then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
			.then((data: { comments?: Comment[] }) => {
				if (cancelled) return;
				setComments(data.comments ?? []);
				setState('ready');
			})
			.catch(() => !cancelled && setState('error'));
		return () => {
			cancelled = true;
		};
	}, [postId]);

	const submit = async (data: CommentFormData): Promise<boolean> => {
		try {
			const response = await fetch('/api/comments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ postId, ...data }),
			});
			if (!response.ok) return false;

			const result: { comment: Comment; pending?: boolean } =
				await response.json();

			if (result.pending) {
				toast('Thanks, your comment is awaiting review', {
					description: 'It will appear here once approved.',
				});
				return true;
			}

			setComments((prev) =>
				data.parentId
					? prev.map((c) =>
							c.id === data.parentId
								? { ...c, replies: [...(c.replies ?? []), result.comment] }
								: c
						)
					: [...prev, result.comment]
			);
			toast('Comment posted');
			return true;
		} catch {
			return false;
		}
	};

	const topLevel = comments.filter((c) => !c.parentId);
	const total = countAll(topLevel);

	return (
		<section
			id="comments"
			className={[styles.CommentSection, className].filter(Boolean).join(' ')}
			aria-labelledby="comments-title"
		>
			<header className={styles.CommentSection__head}>
				<h2 id="comments-title" className={styles.CommentSection__title}>
					Comments
				</h2>
				<p className={styles.CommentSection__count} aria-live="polite">
					{state === 'ready' &&
						`${String(total).padStart(2, '0')} ${total === 1 ? 'comment' : 'comments'}`}
				</p>
			</header>

			<div className={styles.CommentSection__grid}>
				<GoogleReCaptchaProvider
					reCaptchaKey={clientEnv.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
					scriptProps={{ async: true, defer: true, appendTo: 'body' }}
				>
					<div className={styles.CommentSection__compose}>
						<p className={styles.CommentSection__note}>
							Questions, corrections and war stories are all welcome. Some
							comments are held for review; your email is never published.
						</p>
						<CommentForm onSubmit={submit} />
					</div>

					<div className={styles.CommentSection__thread}>
						{state === 'loading' && (
							<p className={styles.CommentSection__status}>Loading comments…</p>
						)}
						{state === 'error' && (
							<p className={styles.CommentSection__status}>
								Comments are unavailable right now. Please try again later.
							</p>
						)}
						{state === 'ready' && topLevel.length === 0 && (
							<p className={styles.CommentSection__empty}>
								No comments yet. Start the conversation.
							</p>
						)}
						{state === 'ready' && topLevel.length > 0 && (
							<ol className={styles.CommentSection__list}>
								{topLevel.map((comment) => (
									<li key={comment.id}>
										<CommentCard comment={comment} onSubmit={submit} />
									</li>
								))}
							</ol>
						)}
					</div>
				</GoogleReCaptchaProvider>
			</div>
		</section>
	);
};

export default CommentSection;
