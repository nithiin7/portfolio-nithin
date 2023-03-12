import Image from 'next/image';

import styles from './Footer.module.scss';
import Logo from 'assets/images/Logo.png';

import { FaFacebookF } from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';
import { IoLogoTwitter } from 'react-icons/io';
import { FaRedditAlien } from 'react-icons/fa';
import { RiSnapchatLine } from 'react-icons/ri';

function Footer() {
	return (
		<footer className={styles['footer']}>
			<div
				data-aos="fade-up"
				data-aos-duration="900"
				data-aos-once="true"
				className={styles['footer__logo']}
			>
				<Image src={Logo} alt="logo" width={1000} height={1000} />
			</div>
			<ul className={styles['footer__permalinks']}>
				<li data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
					<a href="#">Home</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1100" data-aos-once="true">
					<a href="#about">About</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1200" data-aos-once="true">
					<a href="#experience">Experience</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1300" data-aos-once="true">
					<a href="#services">Services</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1400" data-aos-once="true">
					<a href="#portfolio">Portfolio</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1500" data-aos-once="true">
					<a href="#testimonials">Testimonials</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1600" data-aos-once="true">
					<a href="#contact">Contact</a>
				</li>
			</ul>
			<div className={styles['footer__socials']}>
				<a
					data-aos="fade-up"
					data-aos-duration="1700"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<FaFacebookF />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="1800"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<FiInstagram />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="1900"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<RiSnapchatLine />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="2000"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<IoLogoTwitter />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="2100"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<FaRedditAlien />
				</a>
			</div>

			<div
				data-aos="fade-up"
				data-aos-duration="2200"
				data-aos-once="true"
				className={styles['footer__copyright']}
			>
				<small>&copy; Nithin Pradeep. All rights reserved</small>
			</div>
		</footer>
	);
}

export default Footer;
