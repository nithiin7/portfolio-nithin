import styles from './Footer.module.scss';
import Logo from "../../assets/Logo.png";
import { FaFacebookF } from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';
import { IoLogoTwitter } from 'react-icons/io';
import { FaRedditAlien } from 'react-icons/fa';
import { RiSnapchatLine } from 'react-icons/ri';

function Footer() {
	return (
		<footer>
			<div data-aos="fade-up" data-aos-duration="900" className="logo">
				<img src={Logo} alt="logo"></img>
			</div>
			<ul className="permalinks">
				<li data-aos="fade-up" data-aos-duration="1000">
					<a href="#">Home</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1100">
					<a href="#about">About</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1200">
					<a href="#experience">Experience</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1300">
					<a href="#services">Services</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1400">
					<a href="#portfolio">Portfolio</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1500">
					<a href="#testimonials">Testimonials</a>
				</li>
				<li data-aos="fade-up" data-aos-duration="1600">
					<a href="#contact">Contact</a>
				</li>
			</ul>
			<div className="footer__socials">
				<a
					data-aos="fade-up"
					data-aos-duration="1700"
					href="https://facebook.com"
				>
					<FaFacebookF />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="1800"
					href="https://facebook.com"
				>
					<FiInstagram />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="1900"
					href="https://facebook.com"
				>
					<RiSnapchatLine />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="2000"
					href="https://facebook.com"
				>
					<IoLogoTwitter />
				</a>
				<a
					data-aos="fade-up"
					data-aos-duration="2100"
					href="https://facebook.com"
				>
					<FaRedditAlien />
				</a>
			</div>

			<div
				data-aos="fade-up"
				data-aos-duration="2200"
				className="footer__copyright"
			>
				<small>&copy; Nithin Pradeep. All rights reserved</small>
			</div>
		</footer>
	);
}

export default Footer;
