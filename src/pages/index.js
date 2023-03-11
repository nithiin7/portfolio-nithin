import Head from 'next/head';
import styles from 'styles/home.module.scss';
import Typewriter from 'typewriter-effect';
import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';
import ButtonPrimary from 'components/utilities/ButtonPrimary';
// import CV from '../../assets/cv.pdf'
import Avatar from 'assets/images/avatar-nithin.png';
import Image from 'next/image';

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
		</>
	);
}
