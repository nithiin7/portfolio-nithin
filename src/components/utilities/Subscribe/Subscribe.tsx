'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	useCallback,
	useId,
	useState,
	type FC,
	type ReactElement,
} from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { subscribeToNewsletter } from 'app/actions';
import FormField from 'components/utilities/FormField/FormField';
import { emailSchema } from 'helpers/validations';

import styles from './Subscribe.module.scss';

interface SubscribeFormData {
	email: string;
}

interface SubscribeProps {
	className?: string;
}

/** Newsletter sign-up form. */
const Subscribe: FC<SubscribeProps> = ({ className }): ReactElement => {
	const uid = useId();
	const [done, setDone] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SubscribeFormData>({
		resolver: yupResolver(emailSchema),
		defaultValues: { email: '' },
	});

	const focusOnMount = useCallback((node: HTMLParagraphElement | null) => {
		node?.focus();
	}, []);

	const onSubmit: SubmitHandler<SubscribeFormData> = async ({ email }) => {
		setSubmitError(null);
		const result = await subscribeToNewsletter(email);
		if (result.success) setDone(true);
		else setSubmitError('That didn’t work. Please try again in a moment.');
	};

	const label = isSubmitting ? 'Subscribing…' : 'Subscribe';

	return (
		<section
			className={[styles.Subscribe, className].filter(Boolean).join(' ')}
			aria-labelledby={`${uid}-title`}
		>
			<div className={styles.Subscribe__intro}>
				<p className={styles.Subscribe__kicker}>Newsletter</p>
				<h2 id={`${uid}-title`} className={styles.Subscribe__title}>
					New posts, <em>straight to your inbox.</em>
				</h2>
				<p className={styles.Subscribe__text}>
					A short note when something new is published. No spam, unsubscribe any
					time.
				</p>
			</div>

			<div className={styles.Subscribe__action}>
				{done ? (
					<p
						ref={focusOnMount}
						tabIndex={-1}
						className={styles.Subscribe__done}
						role="status"
					>
						<span aria-hidden="true">✓</span> You’re subscribed. Thanks for
						reading.
					</p>
				) : (
					<form
						className={styles.Subscribe__form}
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						aria-busy={isSubmitting}
					>
						<FormField
							{...register('email')}
							id={`${uid}-email`}
							className={styles.Subscribe__field}
							label="Email"
							type="email"
							inputMode="email"
							autoComplete="email"
							placeholder="you@company.com"
							error={errors.email?.message}
						/>
						<button
							type="submit"
							className={styles.Subscribe__submit}
							disabled={isSubmitting}
						>
							<span className={styles.Subscribe__roll}>
								<span>{label}</span>
								<span aria-hidden="true">{label}</span>
							</span>
						</button>
						<p className={styles.Subscribe__error} role="alert">
							{submitError}
						</p>
					</form>
				)}
			</div>
		</section>
	);
};

export default Subscribe;
