'use client';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import emailjs from 'emailjs-com';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';

import { contactSchema } from 'helpers/validations';
import { contactOptions } from 'helpers/constants';

import styles from './ContactForm.module.scss';

import TextInput from 'components/utilities/TextInput';
import TextArea from 'components/utilities/TextArea';

const ContactForm = (props) => {
	const { className, variant } = props;

	const [formSent, setFormSent] = useState(false);
	const form = useRef();

	const {
		formState: { errors },
		control,
		handleSubmit,
	} = useForm({
		resolver: yupResolver(contactSchema),
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
	});

	const onSubmit = (data, e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				process.env.NEXT_PUBLIC_SERVICE_ID,
				process.env.NEXT_PUBLIC_TEMPLATE_ID,
				form.current,
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

	return (
		<div
			className={`${styles.ContactForm} ${
				styles[`ContactForm__${variant}`]
			} ${className}`}
		>
			{formSent ? (
				<div className="contact__success">
					<svg
						width="800px"
						height="800px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
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
					<p className="contact__text">
						Thanks for the ping! Will get back to you soon!
					</p>
				</div>
			) : (
				<div className="contact__container">
					<form
						className="contact__form"
						ref={form}
						onSubmit={handleSubmit(onSubmit)}
					>
						<fieldset className="model__form-item">
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<TextInput
										{...field}
										type="text"
										placeholder="Nithin"
										errors={[errors?.name?.message]}
										label={'Your Name'}
									/>
								)}
							/>
						</fieldset>
						<fieldset className="model__form-item">
							<Controller
								control={control}
								name="email"
								render={({ field }) => (
									<TextInput
										{...field}
										type="text"
										label={'Your Email'}
										placeholder="nithinp150@gmail.com"
										errors={[errors?.email?.message]}
									/>
								)}
							/>
						</fieldset>
						<fieldset className="model__form-item">
							<Controller
								control={control}
								name="message"
								render={({ field }) => (
									<TextArea
										{...field}
										type="text"
										placeholder="Hey! Let's connect."
										label="Message"
										rows="7"
										errors={[errors?.message?.message]}
									/>
								)}
							/>
						</fieldset>
						<button
							type="submit"
							className="contact__button"
							aria-label="Contact Submit"
							role="button"
						>
							<motion.div className="contact__slider">
								<div className="contact__el">
									<div className="contact__PerspectiveText">
										<p>Let&apos;s Do it</p>
										<p>Let&apos;s Do it</p>
									</div>
								</div>
							</motion.div>
						</button>
					</form>
				</div>
			)}
			<div className="contact__socials">
				<div className="contact__options">
					<h6>FURTHER ENQUIRIES OR COLLABORATION</h6>
					{contactOptions.map((option, index) => (
						<div key={index} className="contact__link">
							<a href={option.link}>{option.subtitle}</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

ContactForm.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
};

ContactForm.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
};

export default ContactForm;
