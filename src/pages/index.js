import Head from 'next/head';
import React, { useRef } from 'react';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import Image from 'next/image';
import styles from 'styles/home.module.scss';
import Typewriter from 'typewriter-effect';
import emailjs from 'emailjs-com';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useForm } from 'react-hook-form';

import ButtonPrimary from 'components/utilities/ButtonPrimary';
import ExperienceCard from 'components/pages/ExperienceCard';
import ServiceCard from 'components/pages/ServiceCard';
import PortfolioCard from 'components/pages/PortfolioCard';

import { socialMediaLinks, cardData, contactOptions } from 'helpers/constants';
// import CV from 'assets/documents/cv.pdf'
import success from 'assets/images/success.png';

import { initializeApollo } from '/lib/apolloClient';
import { HOME_PAGE } from 'queries';

export async function getStaticProps() {
	const apolloClient = initializeApollo();

	const data = await apolloClient.query({
		query: HOME_PAGE,
	});

	return {
		props: {
			data,
		},
	};
}

export default function Home(props) {
	const path = props?.data.data.pageCollection.items[0];
	const path_header = path?.sectionCollection.items[0].contentsCollection;
	const header_list = path_header?.items[1].contentsCollection.items[0].list;
	const services_path =
		path.sectionCollection.items[3].contentsCollection.items;
	const portfolio_path =
		path.sectionCollection.items[4].contentsCollection.items[1]
			.contentsCollection.items;
	const testimonial_path =
		path.sectionCollection.items[5].contentsCollection.items[1]
			.contentsCollection.items;

	const form = useRef();
	const formSuccess = useRef();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const sendEmail = (e) => {};

	const onSubmit = (data, e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				process.env.SERVICE_ID,
				process.env.TEMPLATE_ID,
				form.current,
				process.env.EMAILJS_ID
			)
			.then(
				(result) => {
					form.current.style.display = 'none';
					formSuccess.current.style.display = 'block';
				},
				(error) => {
					console.log(error.text);
				}
			);
	};

	return (
		<>
			<Head>
				<title>{path.title}</title>
				<meta name={path?.title} content={path?.description} />
				<meta property="og:title" content={path?.ogtitle}></meta>
				<meta property="og:description" content={path?.description}></meta>
				<meta property="og:url" content={path?.ogurl}></meta>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<header id="home" className={styles['portfolio__header']}>
				<div className={styles['header__container']}>
					<h5 data-aos="fade-up" data-aos-duration="500" data-aos-once="true">
						{path_header?.items[0].title}
					</h5>
					<h1 data-aos="fade-up" data-aos-duration="1000">
						{path_header?.items[0].subTitle}
					</h1>
					<h5
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={styles['text-light']}
					>
						<Typewriter
							options={{
								strings: header_list.map((item) => item),
								autoStart: true,
								loop: true,
							}}
						/>
					</h5>
					<div
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={styles['header__cta']}
					>
						<Link className={styles['header__button']} href={'/cv'} download>
							Download CV
						</Link>
						<ButtonPrimary
							classModifier={'button--primary'}
							href={'contact'}
							data={"Let's Talk"}
							type={'scroll_link'}
						/>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="1400"
						data-aos-once="true"
						className={styles['header__socials']}
					>
						{socialMediaLinks.map((link) => (
							<Link
								key={link.title}
								data-aos="fade-up"
								data-aos-duration={link.duration}
								data-aos-once="true"
								title={link.title}
								href={link.href}
								target={link.target}
							>
								{link.icon}
							</Link>
						))}
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={styles['header__img']}
					>
						<Image
							src={
								path.sectionCollection.items[0].contentsCollection.items[3]
									.contentsCollection.items[0].image.url
							}
							alt={
								path.sectionCollection.items[0].contentsCollection.items[3]
									.contentsCollection.items[0].image.title
							}
							height={1000}
							width={1000}
							quality={100}
							priority
						/>
					</div>
					<ScrollLink to="contact" className={styles['header__scroll-down']}>
						ScrollDown
					</ScrollLink>
				</div>
			</header>
			<section id="about">
				<h5 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{path.sectionCollection.items[1].contentsCollection.items[0].title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">
					{path.sectionCollection.items[1].contentsCollection.items[0].subTitle}
				</h2>
				<div
					data-aos="fade-up"
					data-aos-duration="1300"
					data-aos-once="true"
					className={styles['portfolio__about']}
				>
					<div
						className={styles['about__me']}
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
					>
						<div className={styles['about__me-image']}>
							<Image
								src={
									path.sectionCollection.items[1].contentsCollection.items[1]
										.image.url
								}
								alt="about-me"
								height={1000}
								width={1000}
								quality={100}
								data-aos="fade-up"
								data-aos-duration="1400"
								data-aos-once="true"
							/>
						</div>
					</div>
					<div className={styles['about__content']}>
						<div className={styles['about__cards']}>
							{cardData.map((card, index) => (
								<article
									key={index}
									className={styles['about__card']}
									data-aos="fade-up"
									data-aos-duration={card.duration}
									data-aos-once="true"
								>
									{card.icon}
									<h5>{card.title}</h5>
									<small>{card.description}</small>
								</article>
							))}
						</div>
						<div
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
						>
							{documentToReactComponents(
								path.sectionCollection.items[1].contentsCollection.items[3]
									.descriptionLong.json
							)}
						</div>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={styles['about__icon']}
						>
							<ButtonPrimary
								href={'contact'}
								classModifier={'button--primary'}
								data={'Let’s make something special.'}
								type={'scroll_link'}
							/>
						</div>
					</div>
				</div>
			</section>
			<section id="experience">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{path.sectionCollection.items[2].contentsCollection.items[0].title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{path.sectionCollection.items[2].contentsCollection.items[0].subTitle}
				</h2>
				<div className={styles['portfolio__experience']}>
					<div
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={styles['experience__frontend']}
					>
						<h3
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
						>
							{
								path.sectionCollection.items[2].contentsCollection.items[1]
									.title
							}
						</h3>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={styles['experience__content']}
						>
							{path.sectionCollection.items[2].contentsCollection.items[1].contentsCollection.items?.map(
								(item) => (
									<ExperienceCard
										key={item.title}
										tech={item.title}
										experience={item.description}
									/>
								)
							)}
						</div>
					</div>
					<div className={styles['experience__backend']}>
						<h3
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
						>
							{
								path.sectionCollection.items[2].contentsCollection.items[2]
									.title
							}
						</h3>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={styles['experience__content']}
						>
							{path.sectionCollection.items[2].contentsCollection.items[2].contentsCollection.items?.map(
								(item) => (
									<ExperienceCard
										key={item.title}
										tech={item.title}
										experience={item.description}
									/>
								)
							)}
						</div>
					</div>
				</div>
			</section>
			<section id="services">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{path.sectionCollection.items[3].contentsCollection.items[0].title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{path.sectionCollection.items[3].contentsCollection.items[0].subTitle}
				</h2>
				<div
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-once="true"
					className={styles['portfolio__services']}
				>
					{services_path?.map((item) => {
						if (item.__typename == 'Section') {
							return (
								<ServiceCard
									heading={item.contentsCollection.items[0].title}
									list={item.contentsCollection.items[1].list}
								/>
							);
						}
					})}
				</div>
			</section>
			<section id="portfolio">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{path.sectionCollection.items[4].contentsCollection.items[0].title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{path.sectionCollection.items[4].contentsCollection.items[0].subTitle}
				</h2>
				<div className={styles['portfolio__portfolio']}>
					{portfolio_path.map((item) => {
						return (
							<PortfolioCard
								id={item.id}
								image={item.image.url}
								title={item.title}
								github={item.gitHub}
								demo={item.demo}
							/>
						);
					})}
				</div>
			</section>
			<section id="testimonials">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{path.sectionCollection.items[5].contentsCollection.items[0].title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{path.sectionCollection.items[5].contentsCollection.items[0].subTitle}
				</h2>
				<div data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">
					<Swiper
						className={styles['portfolio__testimonials']}
						modules={[Pagination]}
						navigation
						spaceBetween={40}
						slidesPerView={1}
						pagination={{ clickable: true }}
					>
						{testimonial_path.map((item, index) => {
							return (
								<SwiperSlide
									key={index}
									className={styles['testimonial__container']}
								>
									<div className={styles['testimonial__avatar']}>
										<Image
											src={item.avatar.url}
											alt="Avatar"
											width={1000}
											height={1000}
											priority
											quality={100}
										/>
									</div>
									<h5 className={styles['testimonial__name']}>
										{item.reviewer}
									</h5>
									<small className={styles['testimonial__review']}>
										{item.review}
									</small>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>
			</section>
			<section id="contact">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					{path.sectionCollection.items[6].contentsCollection.items[0].title}
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					{path.sectionCollection.items[6].contentsCollection.items[0].subTitle}
				</h2>

				<div
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-once="true"
					className={styles['contact__container']}
				>
					<div className={styles['contact__options']}>
						{contactOptions.map((option, index) => (
							<article
								key={index}
								data-aos="fade-up"
								data-aos-duration={option.duration}
								data-aos-once="true"
								className={styles['contact__option']}
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
						className={styles['contact__hidden']}
					>
						<div className={styles['contact__success']}>
							<div className={styles['contact__wrap']}>
								<Image
									src={success}
									alt="success"
									height={1000}
									width={1000}
									quality={100}
								/>
							</div>
							<div className={styles['contact__text']}>
								Email Sent Successfully!
							</div>
						</div>
					</div>
					<form
						className={styles['contact__form']}
						ref={form}
						onSubmit={handleSubmit(onSubmit)}
					>
						<input
							{...register('name', {
								required: 'Name is required',
								type: 'text',
								minLength: {
									value: 4,
									message: 'Minimum length of Name should be 4',
								},
								maxLength: {
									value: 25,
									message: 'Maximum length of Name should be 25',
								},
							})}
							className={styles['contact__input']}
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
							type="text"
							name="name"
							placeholder="Your Full Name"
						/>
						{errors.name && <span>{errors.name.message}</span>}
						<input
							{...register('email', {
								required: 'Email address is required',
								pattern: {
									value:
										/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: 'Enter valid email address',
								},
							})}
							className={styles['contact__input']}
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							name="email"
							placeholder="Your Email"
						/>
						{errors.email && <span>{errors.email.message}</span>}
						<textarea
							{...register('message', {
								required: 'This field is required',
								minLength: {
									value: 8,
									message: 'Minimum length of message should be 8',
								},
								maxLength: {
									value: 500,
									message: 'Maximum length of message should be 500',
								},
							})}
							className={styles['contact__textarea']}
							data-aos="fade-up"
							data-aos-duration="1400"
							data-aos-once="true"
							name="message"
							rows="7"
							placeholder="Your Message"
						></textarea>
						{errors.message && <span>{errors.message.message}</span>}
						<button
							data-aos="fade-up"
							data-aos-duration="1500"
							data-aos-once="true"
							type="submit"
							className={styles['contact__button']}
						>
							Send Message
						</button>
					</form>
				</div>
			</section>
		</>
	);
}
