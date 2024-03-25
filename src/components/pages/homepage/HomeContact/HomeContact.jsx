'use client';
import { useRef } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import emailjs from 'emailjs-com';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactSchema } from 'helpers/validations';
import { contactOptions } from 'helpers/constants';

import styles from './HomeContact.module.scss';

import TextInput from 'components/utilities/TextInput';
import TextArea from 'components/utilities/TextArea';
import success from 'assets/images/success.png';

const HomeContact = (props) => {
	const { className, variant, data } = props;

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

	const form = useRef();
	const formSuccess = useRef();

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
					form.current.style.display = 'none';
					formSuccess.current.style.display = 'block';
				},
				(error) => {
					console.log(error.text);
				}
			);
	};

	return (
		<div
			className={`${styles.HomeContact} ${
				styles[`HomeContact__${variant}`]
			} ${className}`}
		>
			<section id="contact">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{data.title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{data.subTitle}
				</h2>
				<div
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-once="true"
					className="contact__container"
				>
					<div className="contact__options">
						{contactOptions.map((option, index) => (
							<article
								key={index}
								data-aos="fade-up"
								data-aos-duration={option.duration}
								data-aos-once="true"
								className="contact__option"
							>
								{option.icon}
								<h4>{option.title}</h4>
								<h5>{option.subtitle}</h5>
								<a href={option.link}>Send a Message</a>
							</article>
						))}
					</div>
					<div
						ref={formSuccess}
						style={{ display: 'none' }}
						className="contact__hidden"
					>
						<div className="contact__success">
							<div className="contact__wrap">
								<Image
									src={success}
									alt="success"
									height={1000}
									width={1000}
									quality={100}
								/>
							</div>
							<div className="contact__text">Email Sent Successfully!</div>
						</div>
					</div>
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
										placeholder="Your Full Name"
										errors={[errors?.name?.message]}
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
										placeholder="Your Email"
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
										placeholder="Your Message"
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
			</section>
		</div>
	);
};

HomeContact.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
};

HomeContact.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
};

export default HomeContact;
