'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useId, useState, type FC, type ReactElement } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm, type SubmitHandler } from 'react-hook-form';

import FormField from 'components/utilities/FormField/FormField';
import { commentSchema } from 'helpers/validations';
import type { CommentFormData } from 'types/comment';

import styles from './CommentForm.module.scss';

const CONTENT_MAX = 1000;

type CommentFields = Pick<
	CommentFormData,
	'authorName' | 'authorEmail' | 'content'
>;

interface CommentFormProps {
	/** Resolves true once the comment is accepted, so the form only clears on success. */
	onSubmit: (data: CommentFormData) => Promise<boolean>;
	parentId?: string;
	replyingTo?: string;
	onCancel?: () => void;
	className?: string;
}

const CommentForm: FC<CommentFormProps> = ({
	onSubmit,
	parentId,
	replyingTo,
	onCancel,
	className,
}): ReactElement => {
	const uid = useId();
	const [submitError, setSubmitError] = useState<string | null>(null);
	const { executeRecaptcha } = useGoogleReCaptcha();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, touchedFields, isSubmitting },
	} = useForm<CommentFields>({
		resolver: yupResolver(commentSchema),
		mode: 'onTouched',
		defaultValues: { authorName: '', authorEmail: '', content: '' },
	});

	const submit: SubmitHandler<CommentFields> = async (data) => {
		setSubmitError(null);
		if (!executeRecaptcha) {
			setSubmitError(
				'Spam protection is still loading. Try again in a moment.'
			);
			return;
		}
		const token = await executeRecaptcha('comment_form').catch(() => null);
		if (!token) {
			setSubmitError('Spam check failed. Please try again.');
			return;
		}
		const ok = await onSubmit({ ...data, parentId, recaptchaToken: token });
		if (ok) reset();
		else setSubmitError('Your comment didn’t go through. Please try again.');
	};

	const field = (name: keyof CommentFields) => ({
		...register(name),
		id: `${uid}-${name}`,
		error: errors[name]?.message,
		valid: Boolean(touchedFields[name]) && !errors[name],
	});

	const label = isSubmitting
		? 'Posting…'
		: replyingTo
			? 'Post reply'
			: 'Post comment';

	return (
		<div className={[styles.CommentForm, className].filter(Boolean).join(' ')}>
			<form
				className={styles.CommentForm__form}
				onSubmit={handleSubmit(submit)}
				noValidate
				aria-busy={isSubmitting}
				aria-label={replyingTo ? `Reply to ${replyingTo}` : 'Leave a comment'}
			>
				<FormField
					{...field('authorName')}
					className={styles.CommentForm__half}
					label="Name"
					placeholder="Jane Doe"
					autoComplete="name"
				/>
				<FormField
					{...field('authorEmail')}
					className={styles.CommentForm__half}
					label="Email (never shown)"
					type="email"
					inputMode="email"
					placeholder="jane@company.com"
					autoComplete="email"
				/>
				<FormField
					{...field('content')}
					label={replyingTo ? `Reply to ${replyingTo}` : 'Comment'}
					multiline
					rows={replyingTo ? 3 : 4}
					placeholder="Add to the discussion…"
					maxLength={CONTENT_MAX}
					count={watch('content').length}
				/>

				<div className={styles.CommentForm__actions}>
					<button
						type="submit"
						className={styles.CommentForm__submit}
						disabled={isSubmitting}
					>
						<span className={styles.CommentForm__roll}>
							<span>{label}</span>
							<span aria-hidden="true">{label}</span>
						</span>
					</button>
					{onCancel && (
						<button
							type="button"
							className={styles.CommentForm__cancel}
							onClick={onCancel}
						>
							Cancel
						</button>
					)}
				</div>

				<p className={styles.CommentForm__error} role="alert">
					{submitError}
				</p>
			</form>
		</div>
	);
};

export default CommentForm;
