'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { TextArea, TextInput } from 'components/utilities';
import { commentSchema } from 'helpers/validations';
import type { CommentFormData } from 'types/comment';

import styles from './CommentForm.module.scss';

interface CommentFormProps {
	onSubmit: (data: CommentFormData) => Promise<void>;
	replyingTo?: string;
	replyingToId?: string;
	onCancelReply?: () => void;
	className?: string;
}

/**
 * CommentForm component for adding comments with validation and animations
 */
const CommentForm: FC<CommentFormProps> = ({
	onSubmit,
	replyingTo,
	replyingToId,
	onCancelReply,
	className = '',
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formSent, setFormSent] = useState(false);
	const { executeRecaptcha } = useGoogleReCaptcha();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CommentFormData>({
		resolver: yupResolver(commentSchema),
		defaultValues: {
			authorName: '',
			authorEmail: '',
			content: '',
			parentId: replyingToId || undefined,
		},
	});

	const handleFormSubmit: SubmitHandler<CommentFormData> = async (data) => {
		if (!executeRecaptcha) {
			toast.error('Spam protection failed to load', {
				description: 'Please refresh the page and try again.',
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const token = await executeRecaptcha('comment_form');

			if (!token) {
				toast.error('Spam protection failed to load', {
					description: 'Please refresh the page and try again.',
				});
				return;
			}

			await onSubmit({ ...data, recaptchaToken: token });
			setFormSent(true);
			reset();

			setTimeout(() => {
				setFormSent(false);
			}, 3000);
		} catch (error) {
			console.error('Error submitting comment:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (formSent) {
		return (
			<motion.div
				className={`${styles.CommentForm} ${styles.CommentForm__success} ${className}`}
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
			>
				<div className={styles.CommentForm__successIcon}>✓</div>
				<h3 className={styles.CommentForm__successTitle}>
					Comment Posted Successfully!
				</h3>
				<p className={styles.CommentForm__successMessage}>
					Thank you for your comment. It will be visible shortly.
				</p>
			</motion.div>
		);
	}

	return (
		<motion.div
			className={`${styles.CommentForm} ${className}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
		>
			{replyingTo && (
				<motion.div
					className={styles.CommentForm__replyHeader}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4 }}
				>
					<span className={styles.CommentForm__replyText}>
						Replying to <strong>{replyingTo}</strong>
					</span>
					<motion.button
						className={styles.CommentForm__cancelReply}
						onClick={onCancelReply}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2 }}
					>
						Cancel
					</motion.button>
				</motion.div>
			)}
			<form
				onSubmit={handleSubmit(handleFormSubmit)}
				className={styles.CommentForm__form}
			>
				<div className={styles.CommentForm__row}>
					<Controller
						name="authorName"
						control={control}
						render={({ field }) => (
							<TextInput
								{...field}
								label="Name"
								placeholder="Your name"
								className={styles.CommentForm__input}
								errors={errors.authorName ? [errors.authorName.message!] : []}
							/>
						)}
					/>
					<Controller
						name="authorEmail"
						control={control}
						render={({ field }) => (
							<TextInput
								{...field}
								label="Email"
								type="email"
								placeholder="your.email@example.com"
								className={styles.CommentForm__input}
								errors={errors.authorEmail ? [errors.authorEmail.message!] : []}
							/>
						)}
					/>
				</div>
				<Controller
					name="content"
					control={control}
					render={({ field }) => (
						<TextArea
							{...field}
							label="Comment"
							placeholder="Share your thoughts..."
							className={styles.CommentForm__textarea}
							errors={errors.content ? [errors.content.message!] : []}
							rows={4}
						/>
					)}
				/>
				<motion.button
					type="submit"
					className={styles.CommentForm__submit}
					disabled={isSubmitting}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					transition={{ duration: 0.2 }}
				>
					{isSubmitting ? (
						<>
							<span className={styles.CommentForm__spinner} />
							Posting...
						</>
					) : (
						'Post Comment'
					)}
				</motion.button>
			</form>
		</motion.div>
	);
};

export default CommentForm;
