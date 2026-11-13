'use client';

import { sendForm } from '@emailjs/browser';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { FC } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import FormField from 'components/utilities/FormField/FormField';
import { useSiteSettings } from 'contexts/SiteSettingsContext';
import { clientEnv } from 'helpers/env';
import { contactSchema } from 'helpers/validations';
import { duration, ease } from 'styles/tokens';

import styles from './ContactForm.module.scss';

interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

interface ContactFormProps {
	className?: string;
}

interface SentMessage {
	name: string;
	email: string;
}

const MESSAGE_MAX = 500;
const SUBMIT_LABEL = 'Send message';

const firstName = (name: string): string => name.trim().split(/\s+/)[0] ?? '';

/**
 * Contact form: validates each field when it loses focus, then live as it is
 * corrected. Submission is reCAPTCHA v3 → EmailJS; the token travels to
 * EmailJS as a hidden `g-recaptcha-response` input on the form element.
 * Fields are never `disabled` while sending: sendForm reads the form's
 * FormData, which omits disabled controls.
 */
const ContactForm: FC<ContactFormProps> = ({ className = '' }) => {
	const { email } = useSiteSettings();
	const [sent, setSent] = useState<SentMessage | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const form = useRef<HTMLFormElement>(null);
	const reduced = useReducedMotion();
	const { executeRecaptcha } = useGoogleReCaptcha();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, touchedFields, isSubmitting },
	} = useForm<ContactFormData>({
		resolver: yupResolver(contactSchema),
		mode: 'onTouched',
		defaultValues: { name: '', email: '', message: '' },
	});

	const messageLength = watch('message').length;

	// AnimatePresence mounts the success panel only after the form has exited,
	// so focus is moved when the heading itself mounts.
	const focusOnMount = useCallback((node: HTMLHeadingElement | null) => {
		node?.focus();
	}, []);

	const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
		setSubmitError(null);

		if (!executeRecaptcha) {
			setSubmitError(
				'Spam protection is still loading. Give it a second and try again.'
			);
			return;
		}

		try {
			const token = await executeRecaptcha('contact_form');
			if (!token) {
				setSubmitError('Spam check failed. Please try again.');
				return;
			}

			const formElement = form.current;
			if (!formElement) throw new Error('Contact form is not mounted');
			let recaptchaInput = formElement.querySelector<HTMLInputElement>(
				'input[name="g-recaptcha-response"]'
			);
			if (!recaptchaInput) {
				recaptchaInput = document.createElement('input');
				recaptchaInput.type = 'hidden';
				recaptchaInput.name = 'g-recaptcha-response';
				formElement.appendChild(recaptchaInput);
			}
			recaptchaInput.value = token;

			await sendForm(
				clientEnv.NEXT_PUBLIC_SERVICE_ID,
				clientEnv.NEXT_PUBLIC_TEMPLATE_ID,
				formElement,
				{ publicKey: clientEnv.NEXT_PUBLIC_EMAILJS_ID }
			);

			setSent({ name: firstName(data.name), email: data.email });
		} catch (error) {
			console.error('Error submitting form:', error);
			setSubmitError(
				`Your message didn’t go through. Try again, or email me at ${email}.`
			);
		}
	};

	const startOver = (): void => {
		reset();
		setSent(null);
	};

	const fieldState = (name: keyof ContactFormData) => ({
		error: errors[name]?.message,
		valid: Boolean(touchedFields[name]) && !errors[name],
	});

	const transition = { duration: reduced ? 0 : duration.base, ease };
	const enter = reduced ? { opacity: 0 } : { opacity: 0, y: '1.5rem' };

	return (
		<div className={`${styles.ContactForm} ${className}`}>
			<AnimatePresence mode="wait" initial={false}>
				{sent ? (
					<motion.div
						key="sent"
						className={styles.ContactForm__success}
						initial={enter}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={transition}
					>
						<p className={styles.ContactForm__label}>
							<span className={styles.ContactForm__tick} aria-hidden="true">
								✓
							</span>
							Message sent
						</p>
						<h2
							ref={focusOnMount}
							tabIndex={-1}
							className={styles.ContactForm__thanks}
						>
							Thanks, <em>{sent.name}</em>.
						</h2>
						<p className={styles.ContactForm__note}>
							It’s in my inbox. I’ll reply to <strong>{sent.email}</strong> as
							soon as I can.
						</p>
						<button
							type="button"
							className={styles.ContactForm__again}
							onClick={startOver}
						>
							Send another message
						</button>
					</motion.div>
				) : (
					<motion.form
						key="form"
						ref={form}
						className={styles.ContactForm__form}
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						aria-busy={isSubmitting}
						initial={enter}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={transition}
					>
						<FormField
							{...register('name')}
							{...fieldState('name')}
							className={styles.ContactForm__half}
							index="01"
							label="Your name"
							placeholder="Jane Doe"
							autoComplete="name"
						/>
						<FormField
							{...register('email')}
							{...fieldState('email')}
							className={styles.ContactForm__half}
							index="02"
							label="Your email"
							type="email"
							inputMode="email"
							placeholder="jane@company.com"
							autoComplete="email"
						/>
						<FormField
							{...register('message')}
							{...fieldState('message')}
							index="03"
							label="Message"
							multiline
							rows={5}
							placeholder="What are you building, and where can I help?"
							maxLength={MESSAGE_MAX}
							count={messageLength}
						/>

						<div className={styles.ContactForm__actions}>
							<button
								type="submit"
								className={styles.ContactForm__submit}
								disabled={isSubmitting}
							>
								<span className={styles.ContactForm__roll}>
									<span>{isSubmitting ? 'Sending…' : SUBMIT_LABEL}</span>
									<span aria-hidden="true">
										{isSubmitting ? 'Sending…' : SUBMIT_LABEL}
									</span>
								</span>
								<span className={styles.ContactForm__arrow} aria-hidden="true">
									→
								</span>
							</button>
						</div>

						<p className={styles.ContactForm__error} role="alert">
							{submitError}
						</p>
					</motion.form>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ContactForm;
