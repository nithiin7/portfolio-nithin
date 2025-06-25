'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { sendForm } from 'emailjs-com';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import TextArea from 'components/utilities/TextArea';
import TextInput from 'components/utilities/TextInput';
import { contactOptions } from 'constants/index';
import { contactSchema } from 'helpers/validations';

import styles from './ContactForm.module.scss';

interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

interface ContactFormProps {
	className?: string;
}

/**
 * ContactForm component for user messages and inquiries.
 * Implements validation, email sending via EmailJS, and animations on submission.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @returns {JSX.Element} The rendered ContactForm component.
 */
const ContactForm: FC<ContactFormProps> = ({ className = '' }) => {
	const [formSent, setFormSent] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useRef<HTMLFormElement>(null);
	const { executeRecaptcha } = useGoogleReCaptcha();

	const {
		formState: { errors },
		control,
		handleSubmit,
	} = useForm<ContactFormData>({
		resolver: yupResolver(contactSchema),
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
	});

	/**
	 * Handles form submission, sending data via EmailJS and showing success feedback.
	 *
	 * @param {ContactFormData} data - Form data including name, email, and message.
	 * @param {FormEvent} e - Form submit event.
	 */
	const onSubmit: SubmitHandler<ContactFormData> = async (data, e) => {
		if (e) {
			e.preventDefault();
		}

		if (!executeRecaptcha) {
			return;
		}

		setIsSubmitting(true);

		try {
			const token = await executeRecaptcha('contact_form');

			if (!token) {
				return;
			}

			// Add the token to the form
			const formElement = form.current;
			if (formElement) {
				const recaptchaInput = document.createElement('input');
				recaptchaInput.type = 'hidden';
				recaptchaInput.name = 'g-recaptcha-response';
				recaptchaInput.value = token;
				formElement.appendChild(recaptchaInput);
			}

			await sendForm(
				process.env.NEXT_PUBLIC_SERVICE_ID!,
				process.env.NEXT_PUBLIC_TEMPLATE_ID!,
				form.current!,
				process.env.NEXT_PUBLIC_EMAILJS_ID
			);

			setFormSent(true);
			setTimeout(() => {
				setFormSent(false);
			}, 10000);
		} catch (error) {
			console.error('Error submitting form:', error);
			setIsSubmitting(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const animate = {
		visible: { opacity: 1, scale: 1 },
		hidden: { opacity: 0, scale: 0 },
	};

	return (
		<div className={`${styles.ContactForm}  ${className}`}>
			{formSent ? (
				<motion.div
					className={styles.contact__success}
					aria-hidden={!formSent}
					variants={animate}
					initial={formSent ? 'hidden' : 'visible'}
					animate={'visible'}
				>
					<svg
						width="800px"
						height="800px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M7.29417 12.9577L10.5048 16.1681L17.6729 9"
							stroke="$color-secondary"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="$color-secondary"
							strokeWidth="2"
						/>
					</svg>
					<p className={styles.contact__text}>
						Thanks for the ping! Will get back to you soon!
					</p>
				</motion.div>
			) : (
				<div className={styles.contact__container}>
					<form
						className={styles.contact__form}
						ref={form}
						onSubmit={handleSubmit(onSubmit)}
					>
						<fieldset className={styles['model__form-item']}>
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<TextInput
										{...field}
										type="text"
										placeholder="Nithin"
										errors={
											errors?.name?.message ? [errors?.name?.message] : []
										}
										label={'Your Name'}
									/>
								)}
							/>
						</fieldset>
						<fieldset className={styles['model__form-item']}>
							<Controller
								control={control}
								name="email"
								render={({ field }) => (
									<TextInput
										{...field}
										type="text"
										label={'Your Email'}
										placeholder="nithinp150@gmail.com"
										errors={
											errors?.email?.message ? [errors?.email?.message] : []
										}
									/>
								)}
							/>
						</fieldset>
						<fieldset className={styles['model__form-item']}>
							<Controller
								control={control}
								name="message"
								render={({ field }) => (
									<TextArea
										{...field}
										placeholder="Hey! Let's connect."
										label="Message"
										rows={7}
										errors={
											errors?.message?.message ? [errors?.message?.message] : []
										}
									/>
								)}
							/>
						</fieldset>
						<button
							type="submit"
							className={styles.contact__button}
							aria-label="Submit"
							disabled={isSubmitting}
						>
							<motion.div className={styles.contact__slider}>
								<div className={styles.contact__el}>
									<div className={styles.contact__PerspectiveText}>
										<p>{isSubmitting ? 'Sending...' : "Let's Do it"}</p>
										<p>{isSubmitting ? 'Sending...' : "Let's Do it"}</p>
									</div>
								</div>
							</motion.div>
						</button>
					</form>
				</div>
			)}
			<div className={styles.contact__socials}>
				<div className={styles.contact__options}>
					<h3>FURTHER ENQUIRIES OR COLLABORATION</h3>
					{contactOptions.map((option, index) => (
						<div
							key={`${option.subtitle}-${index}`}
							className={styles.contact__link}
						>
							<Link href={option.link} title={option.subtitle}>
								{option.subtitle}
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ContactForm;
