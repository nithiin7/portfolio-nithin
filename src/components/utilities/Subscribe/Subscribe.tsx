'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { emailSchema } from 'helpers/validations';
import { subscribeToNewsletter } from 'models/subscription';

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

		try {
			await subscribeToNewsletter(data.email);

			setIsSuccess(true);
			reset();

			setTimeout(() => {
				setIsSuccess(false);
			}, 5000);
		} catch (error) {
			console.error('Error subscribing to newsletter:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<motion.section
			className={`${styles.subscribe} ${className}`}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
		>
			<div className={styles.subscribe__content}>
				<h2 className={styles.subscribe__title}>STAY UPDATED</h2>
				<p className={styles.subscribe__text}>
					Get notified when I publish new articles about design, development,
					and creative insights.
				</p>
				{isSuccess ? (
					<motion.div
						className={styles.subscribe__success}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
					>
						<div className={styles.subscribe__successIcon}>✓</div>
						<h3 className={styles.subscribe__successTitle}>
							Successfully Subscribed!
						</h3>
						<p className={styles.subscribe__successText}>
							Thank you for subscribing. You'll now receive updates about
							design, development, and creative insights.
						</p>
					</motion.div>
				) : (
					<form
						onSubmit={handleSubmit(onSubmit)}
						className={styles.subscribe__form}
					>
						<div className={styles.subscribe__inputWrapper}>
							<input
								type="email"
								placeholder="Enter your email"
								className={`${styles.subscribe__input} ${errors?.email ? styles.subscribe__inputError : ''}`}
								disabled={isSubmitting}
								{...register('email')}
							/>
							{errors?.email && (
								<span className={styles.subscribe__error}>
									{errors.email.message}
								</span>
							)}
						</div>
						<button
							type="submit"
							className={styles.subscribe__button}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Subscribing...' : 'Subscribe'}
						</button>
					</form>
				)}
			</div>
		</motion.section>
	);
};

export default Subscribe;
