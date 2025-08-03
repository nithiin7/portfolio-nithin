'use client';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useState } from 'react';
import * as yup from 'yup';

import { emailSchema } from 'helpers/validations';

import styles from './Subscribe.module.scss';

interface SubscribeProps {
	className?: string;
	delay?: number;
}

/**
 * Reusable Subscribe component for newsletter signup
 */
const Subscribe: FC<SubscribeProps> = ({ className = '', delay = 0 }) => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);

		if (error) {
			setError('');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');

		try {
			await emailSchema.validate({ email });

			console.log('Subscribing email:', email);

			setIsSuccess(true);
			setEmail('');

			setTimeout(() => {
				setIsSuccess(false);
			}, 5000);
		} catch (validationError) {
			if (validationError instanceof yup.ValidationError) {
				setError(validationError.errors[0]);
			} else {
				setError('Something went wrong. Please try again.');
			}
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
					<form onSubmit={handleSubmit} className={styles.subscribe__form}>
						<div className={styles.subscribe__inputWrapper}>
							<input
								type="email"
								placeholder="Enter your email"
								className={`${styles.subscribe__input} ${error ? styles.subscribe__inputError : ''}`}
								value={email}
								onChange={handleEmailChange}
								disabled={isSubmitting}
							/>
							{error && (
								<span className={styles.subscribe__error}>{error}</span>
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
