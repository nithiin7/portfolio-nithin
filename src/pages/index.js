import Head from 'next/head';
import styles from 'styles/home.module.scss';
import Typewriter from 'typewriter-effect';
import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';
import { FaAward } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { VscFolderLibrary } from 'react-icons/vsc';
import ButtonPrimary from 'components/utilities/ButtonPrimary';
// import CV from '../../assets/cv.pdf'
import Avatar from 'assets/images/avatar-nithin.png';
import Image from 'next/image';
import experience_settings from 'helpers/config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ExperienceCard from 'components/pages/ExperienceCard';
import { BsPatchCheckFill } from 'react-icons/bs';

export default function Home() {
	return (
		<>
			<Head>
				<title>Portfolio Nithin</title>
				<meta
					name="Portfolio Website - Nithin Pradeep"
					content="A Portfolio Website Created by Nithin Pradeep"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header className={styles['portfolio__header']}>
				<div className={styles['header__container']}>
					<h5 data-aos="fade-up" data-aos-duration="500" data-aos-once="true">
						Hello I'm
					</h5>
					<h1 data-aos="fade-up" data-aos-duration="1000">
						Nithin Pradeep
					</h1>
					<h5
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className="text-light"
					>
						<Typewriter
							options={{
								strings: [
									'Enthusiastic Dev',
									'Fullstack Developer',
									'Cross-Platform Dev',
								],
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
						<ButtonPrimary
							classModifier="button"
							href={'/cv'}
							download={'yes'}
							data={'Download CV'}
						/>
						<ButtonPrimary
							classModifier={'button--primary'}
							href={'#contact'}
							data={'Lets Talk'}
						/>
					</div>
					<div className={styles['header__socials']}>
						<a
							data-aos="fade-up"
							data-aos-duration="1000"
							data-aos-once="true"
							href="#linkedin"
							target="_blank"
						>
							<BsLinkedin />
						</a>
						<a
							data-aos="fade-up"
							data-aos-duration="1200"
							data-aos-once="true"
							href="#github"
							target="_blank"
						>
							<FaGithub />
						</a>
						<a
							data-aos="fade-up"
							data-aos-duration="1400"
							data-aos-once="true"
							href="#instagram"
							target="_blank"
						>
							<RiInstagramFill />
						</a>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={styles['header__img']}
					>
						<Image
							src={Avatar}
							alt="avatar-nithin"
							height={1000}
							width={1000}
						/>
					</div>
					<a href="#contact" className={styles['header__scroll-down']}>
						ScrollDown
					</a>
				</div>
			</header>
			<section id="about">
				<h5 data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					Get to Know
				</h5>
				<h2 data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">
					About Me
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
							<img
								src=""
								alt="about-me"
								data-aos="fade-up"
								data-aos-duration="1400"
								data-aos-once="true"
							/>
						</div>
					</div>

					<div className={styles['about__content']}>
						<div className={styles['about__cards']}>
							<article
								className={styles['about__card']}
								data-aos="fade-up"
								data-aos-duration="1000"
								data-aos-once="true"
							>
								<FaAward className={styles['about__icon']} />
								<h5>Clients</h5>
								<small>0+ Clients</small>
							</article>
							<article
								className={styles['about__card']}
								data-aos="fade-up"
								data-aos-duration="1100"
								data-aos-once="true"
							>
								<FiUsers className={styles['about__icon']} />
								<h5>Work</h5>
								<small>3+ Months Working</small>
							</article>
							<article
								className={styles['about__card']}
								data-aos="fade-up"
								data-aos-duration="1200"
								data-aos-once="true"
							>
								<VscFolderLibrary className={styles['about__icon']} />
								<h5>Projects</h5>
								<small>10+ Completed</small>
							</article>
						</div>
						<p data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic quo
							vero incidunt facere, ex rem cum odio sint. Quisquam tempora
							accusamus numquam porro temporibus fugit. Praesentium inventore
							ullam vero accusantium!
						</p>
						<div
							data-aos="fade-up"
							data-aos-duration="1300"
							data-aos-once="true"
							className={styles['about__icon']}
						>
							<ButtonPrimary
								href={'#contact'}
								classModifier={'button--primary'}
								data={"Let's Talk"}
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
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
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
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
							<ExperienceCard tech={'HTML'} experience={'Intermediate'} />
						</div>
					</div>
				</div>
				<div className={styles['experience__slider']}>
					<Slider {...experience_settings}>
						<div></div>
					</Slider>
				</div>
			</section>
		</>
	);
}
