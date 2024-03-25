'use client';
import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import Typewriter from 'typewriter-effect';
import { useLenis } from '@studio-freight/react-lenis';
import { Link as ScrollLink } from 'react-scroll';

import styles from './HomeHeader.module.scss';
import CV from 'assets/documents/cv.pdf';
import { socialMediaLinks } from 'helpers/constants';

import Button from 'components/utilities/Button';

const HomeHeader = (props) => {
	const { className, variant, data } = props;

	const lenis = useLenis();

	const handleScroll = (to) => {
		if (lenis) {
			lenis.scrollTo(`#${to}`, {
				duration: 2,
			});
		}
	};

	return (
		<div
			className={`${styles.HomeHeader} ${
				styles[`HomeHeader__${variant}`]
			} ${className}`}
		>
			<header id="home" className={'portfolio__header'}>
				<div className={'header__container'}>
					<h5 data-aos="fade-up" data-aos-duration="500" data-aos-once="true">
						{data.items[0].title}
					</h5>
					<h1 data-aos="fade-up" data-aos-duration="1000">
						{data?.items[0].subTitle}
					</h1>
					<h5
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={'text-light'}
					>
						<Typewriter
							options={{
								strings: data.items[1].contentsCollection.items[0].list.map(
									(item) => item
								),
								autoStart: true,
								loop: true,
							}}
						/>
					</h5>
					<div
						data-aos="fade-up"
						data-aos-duration="1200"
						data-aos-once="true"
						className={'header__cta'}
					>
						<a className={'header__button'} href={CV} download>
							Download CV
						</a>
						<Button
							classModifier={'Button--primary'}
							href={'contact'}
							data={"Let's Talk"}
							type={'scroll_link'}
						/>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="1400"
						data-aos-once="true"
						className={'header__socials'}
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
						className={'header__img'}
					>
						<Image
							src={data.items[3].contentsCollection.items[0].image.url}
							alt={data.items[3].contentsCollection.items[0].image.title}
							height={1000}
							width={1000}
							quality={100}
							priority
						/>
					</div>
					<ScrollLink
						to="contact"
						className={'header__scroll-down'}
						onClick={() => handleScroll('contact')}
					>
						ScrollDown
					</ScrollLink>
				</div>
			</header>
		</div>
	);
};

HomeHeader.defaultProps = {
	variant: 'default',
	className: '',
	data: {},
};

HomeHeader.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
	data: PropTypes.object,
};

export default HomeHeader;
