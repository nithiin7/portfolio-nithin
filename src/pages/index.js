import Head from 'next/head';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from 'styles/home.module.scss';
import Typewriter from 'typewriter-effect';
import emailjs from 'emailjs-com';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import ButtonPrimary from 'components/utilities/ButtonPrimary';
import ExperienceCard from 'components/pages/ExperienceCard';
import ServiceCard from 'components/pages/ServiceCard';
import PortfolioCard from 'components/pages/PortfolioCard';
import experience_settings from 'helpers/config';

import { socialMediaLinks, cardData } from 'helpers/constants';
// import CV from 'assets/documents/cv.pdf'
import portfolio from 'assets/images/portfolio1.jpg';
import IMGTEST from 'assets/images/avatar2.jpg';

import { MdOutlineMail } from 'react-icons/md';
import { RiMessengerLine } from 'react-icons/ri';
import { BsWhatsapp } from 'react-icons/bs';

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
	console.log(
		path.sectionCollection.items[1].contentsCollection.items[1].image.url
	);
	const form = useRef();

	const sendEmail = (e) => {
		e.preventDefault();

		emailjs.sendForm(
			'YOUR_SERVICE_ID',
			'YOUR_TEMPLATE_ID',
			form.current,
			'YOUR_PUBLIC_KEY'
		);

		e.target.reset();
	};
	const data = [
		{
			id: 1,
			image: portfolio,
			title: 'Github',
			github: '',
			demo: '',
		},
		{
			id: 2,
			image: portfolio,
			title: 'Github',
			github: '',
			demo: '',
		},
		{
			id: 3,
			image: portfolio,
			title: 'Github',
			github: '',
			demo: '',
		},
		{
			id: 4,
			image: portfolio,
			title: 'Github',
			github: '',
			demo: '',
		},
		{
			id: 5,
			image: portfolio,
			title: 'Github',
			github: '',
			demo: '',
		},
		{
			id: 6,
			image: portfolio,
			title: 'Github',
			github: '',
			demo: '',
		},
	];

	const data_testimonials = [
		{
			avatar: IMGTEST,
			name: 'Name',
			review:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas a aliquam esse sint. Illo beatae veritatis iure sequi aspernatur ut, cum accusamus architecto ipsam repellendus, commodi, dolores eum provident cupiditate.',
		},
		{
			avatar: IMGTEST,
			name: 'Name',
			review:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas a aliquam esse sint. Illo beatae veritatis iure sequi aspernatur ut, cum accusamus architecto ipsam repellendus, commodi, dolores eum provident cupiditate.',
		},
		{
			avatar: IMGTEST,
			name: 'Name',
			review:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas a aliquam esse sint. Illo beatae veritatis iure sequi aspernatur ut, cum accusamus architecto ipsam repellendus, commodi, dolores eum provident cupiditate.',
		},
		{
			avatar: IMGTEST,
			name: 'Name',
			review:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas a aliquam esse sint. Illo beatae veritatis iure sequi aspernatur ut, cum accusamus architecto ipsam repellendus, commodi, dolores eum provident cupiditate.',
		},
	];

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
			<header className={styles['portfolio__header']}>
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
							href={'#contact'}
							data={"Let's Talk"}
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
					<Link href="#contact" className={styles['header__scroll-down']}>
						ScrollDown
					</Link>
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
								href={'#contact'}
								classModifier={'button--primary'}
								data={'Let’s make something special.'}
							/>
						</div>
					</div>
				</div>
			</section>
			<section id="experience">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					What Skills I Have
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					My Experience
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
							Frontend Development
						</h3>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={styles['experience__content']}
						>
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'CSS'} experience={'Intermediate'} />
							<ExperienceCard tech={'SASS'} experience={'Intermediate'} />
							<ExperienceCard tech={'NextJS'} experience={'Intermediate'} />
							<ExperienceCard tech={'ReactJS'} experience={'Intermediate'} />
							<ExperienceCard tech={'Angular'} experience={'Beginner'} />
							<ExperienceCard tech={'.NET'} experience={'Beginner'} />
							<ExperienceCard tech={'Unity'} experience={'Beginner'} />
							<ExperienceCard tech={'Flutter'} experience={'Beginner'} />
							<ExperienceCard tech={'Wordpress'} experience={'Beginner'} />
						</div>
					</div>
					<div className={styles['experience__backend']}>
						<h3
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
						>
							Backend Development
						</h3>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={styles['experience__content']}
						>
							<ExperienceCard tech={'PHP'} experience={'Intermediate'} />
							<ExperienceCard tech={'JavaScript'} experience={'Intermediate'} />
							<ExperienceCard tech={'C#'} experience={'Intermediate'} />
							<ExperienceCard tech={'C++'} experience={'Intermediate'} />
							<ExperienceCard tech={'Laravel'} experience={'Intermediate'} />
							<ExperienceCard tech={'Contentful'} experience={'Intermediate'} />
							<ExperienceCard tech={'MySQL'} experience={'Intermediate'} />
							<ExperienceCard tech={'MongoDB'} experience={'Beginner'} />
						</div>
					</div>
				</div>
				<div className={styles['experience__slider']}>
					<Slider {...experience_settings}>
						<div></div>
					</Slider>
				</div>
			</section>
			<section id="services">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					What I Offer
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					Services
				</h2>

				<div
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-once="true"
					className={styles['portfolio__services']}
				>
					<ServiceCard heading={'Web Development'} />
					<ServiceCard heading={'API Creation'} />
					<ServiceCard heading={'Headless CMS Integration'} />
				</div>
			</section>
			<section id="portfolio">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					My Recent Work
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					Portfolio
				</h2>
				<div className={styles['portfolio__portfolio']}>
					{data.map(({ id, image, title, github, demo }) => {
						return (
							<PortfolioCard
								id={id}
								image={image}
								title={title}
								github={github}
								demo={demo}
							/>
						);
					})}
				</div>
			</section>
			<section id="testimonials">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					Review from clients
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					Testimonials
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
						{data_testimonials.map(({ avatar, name, review }, index) => {
							return (
								<SwiperSlide
									key={index}
									className={styles['testimonial__container']}
								>
									<div className={styles['testimonial__avatar']}>
										<Image
											src={avatar}
											alt="Avatar"
											width={1000}
											height={1000}
											priority
										/>
									</div>
									<h5 className={styles['testimonial__name']}>{name}</h5>
									<small className={styles['testimonial__review']}>
										{review}
									</small>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>
			</section>
			<section id="contact">
				<h5 data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					Get In Touch
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					Contact Me
				</h2>

				<div
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-once="true"
					className={styles['contact__container']}
				>
					<div
						data-aos="fade-up"
						data-aos-duration="1300"
						data-aos-once="true"
						className={styles['contact__options']}
					>
						<article
							data-aos="fade-up"
							data-aos-duration="1400"
							data-aos-once="true"
							className={styles['contact__option']}
						>
							<MdOutlineMail className={styles['contact__option-icon']} />
							<h4>Email</h4>
							<h5>nithinp150@gmail.com</h5>
							<a href="mailto:nithinp150@gmail.com">Send a Message</a>
						</article>
						<article
							data-aos="fade-up"
							data-aos-duration="1500"
							data-aos-once="true"
							className={styles['contact__option']}
						>
							<BsWhatsapp className={styles['contact__option-icon']} />
							<h4>WhatsApp</h4>
							<h5>+91-9645018007</h5>
							<a href="https://api.whatsapp.com/send?phone=+919645018007">
								Send a Message
							</a>
						</article>
						<article
							data-aos="fade-up"
							data-aos-duration="1600"
							data-aos-once="true"
							className={styles['contact__option']}
						>
							<RiMessengerLine className={styles['contact__option-icon']} />
							<h4>Messenger</h4>
							<h5>Nithin Pradeep</h5>
							<a href="https://facebook.com">Send a Message</a>
						</article>
					</div>
					<form
						className={styles['contact__form']}
						ref={form}
						onSubmit={sendEmail}
					>
						<input
							className={styles['contact__input']}
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
							type="text"
							name="name"
							placeholder="Your Full Name"
							required
						/>
						<input
							className={styles['contact__input']}
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							type="email"
							name="email"
							placeholder="Your Email"
							required
						/>
						<textarea
							className={styles['contact__textarea']}
							data-aos="fade-up"
							data-aos-duration="1400"
							data-aos-once="true"
							name="message"
							rows="7"
							placeholder="Your Message"
							required
						></textarea>
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
