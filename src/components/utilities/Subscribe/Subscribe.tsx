'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { subscribeToNewsletter } from 'app/actions';
import { ArrowRightIcon } from 'assets/icons';
import { emailSchema } from 'helpers/validations';

import styles from './Subscribe.module.scss';

interface SubscribeFormData {
	email: string;
}

interface SubscribeProps {
	className?: string;
	delay?: number;
}

/**
 * Reusable Subscribe component for newsletter signup
 */
const Subscribe: FC<SubscribeProps> = ({ className = '', delay = 0 }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);

	const {
		formState: { errors },
		register,
		handleSubmit,
		reset,
	} = useForm<SubscribeFormData>({
		resolver: yupResolver(emailSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit: SubmitHandler<SubscribeFormData> = async (data) => {
		setIsSubmitting(true);

		const result = await subscribeToNewsletter(data.email);

		if (result.success) {
			setIsSuccess(true);
			reset();

			setTimeout(() => {
				setIsSuccess(false);
			}, 5000);
		} else {
			setIsError(true);
			setTimeout(() => setIsError(false), 5000);
		}

		setIsSubmitting(false);
	};

	return (
		<motion.section
			className={`${styles.Subscribe} ${className}`}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
		>
			<div className={styles.Subscribe__content}>
				<span className={styles.Subscribe__label}>Newsletter</span>
				<h2 className={styles.Subscribe__title}>Stay Updated</h2>
				<p className={styles.Subscribe__text}>
					Get notified when I publish new articles about design, development,
					and creative insights.
				</p>
				{isSuccess ? (
					<motion.div
						className={styles.Subscribe__success}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
					>
						<div className={styles.Subscribe__successIcon}>✓</div>
						<h3 className={styles.Subscribe__successTitle}>
							Successfully Subscribed!
						</h3>
						<p className={styles.Subscribe__successText}>
							Thank you for subscribing. You'll now receive updates about
							design, development, and creative insights.
						</p>
					</motion.div>
				) : (
					<form
						onSubmit={handleSubmit(onSubmit)}
						className={styles.Subscribe__form}
					>
						<div className={styles.Subscribe__inputWrapper}>
							<input
								type="email"
								placeholder="Enter your email"
								className={`${styles.Subscribe__input} ${errors?.email ? styles.Subscribe__inputError : ''}`}
								disabled={isSubmitting}
								{...register('email')}
							/>
							{errors?.email && (
								<span className={styles.Subscribe__error}>
									{errors.email.message}
								</span>
							)}
						</div>
						<button
							type="submit"
							className={styles.Subscribe__button}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Subscribing...' : 'Subscribe'}
							{!isSubmitting && <ArrowRightIcon />}
						</button>
					</form>
				)}
				{isError && (
					<motion.p
						className={styles.Subscribe__submitError}
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.3 }}
					>
						Something went wrong. Please try again.
					</motion.p>
				)}
			</div>
		</motion.section>
	);
};

export default Subscribe;
