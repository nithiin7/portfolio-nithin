'use client';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import emailjs from 'emailjs-com';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
							stroke="rgb(57 54 50)"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="rgb(57 54 50)"
							strokeWidth="2"
						/>
					</svg>
					<p className="contact__text">
						Thanks for the ping! Will get back to you soon!
					</p>
				</div>
			) : (
				<div
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-once="true"
					className="contact__container"
				>
					<form
						className="contact__form"
						ref={form}
						onSubmit={handleSubmit(onSubmit)}
					>
						<fieldset
							className="model__form-item"
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
						>
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
						<fieldset
							className="model__form-item"
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
						>
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
						<fieldset
							className="model__form-item"
							data-aos="fade-up"
							data-aos-duration="1400"
							data-aos-once="true"
						>
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
							data-aos="fade-up"
							data-aos-duration="1500"
							data-aos-once="true"
							type="submit"
							className="contact__button"
						>
							Send Message
						</button>
					</form>
				</div>
			)}
			<div className="contact__socials">
				<div className="contact__options">
					<h6>FURTHER ENQUIRIES OR COLLABORATION</h6>
					{contactOptions.map((option, index) => (
						<div
							key={index}
							data-aos="fade-up"
							data-aos-duration={option.duration}
							data-aos-once="true"
							className="contact__link"
						>
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
