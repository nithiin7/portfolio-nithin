import Image from 'next/image';
import Link from 'next/link';

import styles from './Footer.module.scss';
import Logo from 'assets/images/Logo.png';

import { footerLinks, socials } from 'helpers/constants.js';

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
				{footerLinks.map((link) => (
					<li
						key={link.key}
						data-aos="fade-up"
						data-aos-duration={link.duration}
						data-aos-once="true"
					>
						<Link href={link.href}>{link.key}</Link>
					</li>
				))}
			</ul>
			<div className={styles['footer__socials']}>
				{socials.map((social, index) => (
					<Link
						key={index}
						data-aos="fade-up"
						data-aos-offset="0"
						data-aos-duration={social.duration}
						data-aos-once="true"
						href={social.link}
					>
						{social.icon}
					</Link>
				))}
			</div>

			<div
				data-aos="fade-up"
				data-aos-offset="0"
				data-aos-duration="1500"
				data-aos-once="true"
				className={styles['footer__copyright']}
			>
				<small>&copy; Nithin Pradeep. All rights reserved</small>
			</div>
		</footer>
	);
}

export default Footer;
