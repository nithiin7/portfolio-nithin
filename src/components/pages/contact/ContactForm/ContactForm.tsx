'use client';
import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { contactSchema } from 'helpers/validations';
import { contactOptions } from 'constants/index';

import styles from './ContactForm.module.scss';

import TextInput from 'components/utilities/TextInput';
import TextArea from 'components/utilities/TextArea';

interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

interface ContactFormProps {
	className?: string;
	variant?: 'default' | 'alternative';
}

/**
 * ContactForm component for user messages and inquiries.
 * Implements validation, email sending via EmailJS, and animations on submission.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {'default' | 'alternative'} [variant='default'] - Visual variant of the form.
 * @returns {JSX.Element} The rendered ContactForm component.
 */
const ContactForm: React.FC<ContactFormProps> = ({
	className = '',
	variant = 'default',
}) => {
	const [formSent, setFormSent] = useState(false);
	const form = useRef<HTMLFormElement>(null);

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
	 * @param {React.FormEvent} e - Form submit event.
	 */
	const onSubmit: SubmitHandler<ContactFormData> = (data, e) => {
		if (e) {
			e.preventDefault();
		}

		emailjs
			.sendForm(
				process.env.NEXT_PUBLIC_SERVICE_ID!,
				process.env.NEXT_PUBLIC_TEMPLATE_ID!,
				form.current!,
				process.env.NEXT_PUBLIC_EMAILJS_ID
			)
			.then(
				() => {
					setFormSent(true);
					setTimeout(() => {
						setFormSent(false);
					}, 10000);
				},
				(error) => {
					console.log(error.text);
				}
			);
	};

	const animate = {
		visible: { opacity: 1, scale: 1 },
		hidden: { opacity: 0, scale: 0 },
	};

	return (
		<div
			className={`${styles.ContactForm} ${
				styles[`ContactForm__${variant}`]
			} ${className}`}
		>
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
						>
							<motion.div className={styles.contact__slider}>
								<div className={styles.contact__el}>
									<div className={styles.contact__PerspectiveText}>
										<p>Let&apos;s Do it</p>
										<p>Let&apos;s Do it</p>
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
						<div key={index} className={styles.contact__link}>
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
