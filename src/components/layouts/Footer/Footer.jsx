import Image from 'next/image';
import Link from 'next/link';

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
				<li
					key={'home'}
					data-aos="fade-up"
					data-aos-duration="1000"
					data-aos-once="true"
				>
					<Link href="#">Home</Link>
				</li>
				<li
					key={'about'}
					data-aos="fade-up"
					data-aos-duration="1100"
					data-aos-once="true"
				>
					<Link href="#about">About</Link>
				</li>
				<li
					key={'experience'}
					data-aos="fade-up"
					data-aos-duration="1200"
					data-aos-once="true"
				>
					<Link href="#experience">Experience</Link>
				</li>
				<li
					key={'services'}
					data-aos="fade-up"
					data-aos-duration="1300"
					data-aos-once="true"
				>
					<Link href="#services">Services</Link>
				</li>
				<li
					key={'portfolio'}
					data-aos="fade-up"
					data-aos-duration="1400"
					data-aos-once="true"
				>
					<Link href="#portfolio">Portfolio</Link>
				</li>
				<li
					key={'testimonials'}
					data-aos="fade-up"
					data-aos-duration="1500"
					data-aos-once="true"
				>
					<Link href="#testimonials">Testimonials</Link>
				</li>
				<li
					key={'contact'}
					data-aos="fade-up"
					data-aos-duration="1600"
					data-aos-once="true"
				>
					<Link href="#contact">Contact</Link>
				</li>
			</ul>
			<div className={styles['footer__socials']}>
				<Link
					data-aos="fade-up"
					data-aos-duration="1700"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<FaFacebookF />
				</Link>
				<Link
					data-aos="fade-up"
					data-aos-duration="1800"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<FiInstagram />
				</Link>
				<Link
					data-aos="fade-up"
					data-aos-duration="1900"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<RiSnapchatLine />
				</Link>
				<Link
					data-aos="fade-up"
					data-aos-duration="2000"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<IoLogoTwitter />
				</Link>
				<Link
					data-aos="fade-up"
					data-aos-duration="2100"
					data-aos-once="true"
					href="https://facebook.com"
				>
					<FaRedditAlien />
				</Link>
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
