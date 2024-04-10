'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { AnimatePresence, motion, useScroll } from 'framer-motion';

import styles from './Menu.module.scss';
import BG from 'assets/images/menu-bg.svg';

const Menu = (props) => {
	const { className, variant } = props;

	const [isMenuActive, setIsMenuActive] = useState(false);
	const [hidden, setHidden] = useState(false);

	const { scrollY } = useScroll();

	const links = [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: 'Services',
			href: '/#services',
		},
		{
			title: 'Works',
			href: '/#portfolio',
		},
		{
			title: 'About',
			href: '/#about',
		},
		{
			title: 'Companies',
			href: '/#collaborations',
		},
		{
			title: 'Contact',
			href: '/#contact',
		},
	];

	const socials = [
		{
			title: 'Linkedin',
			href: 'https://www.linkedin.com/in/nithin-p7/',
		},
		{
			title: 'Instagram',
			href: 'https://www.instagram.com/__nithiin__/',
		},
		{
			title: 'Twitter',
			href: 'https://twitter.com/_nithiin7',
		},
	];

	const animate = {
		initial: {
			opacity: 0,
			y: '100%',
		},
		enter: (i) => ({
			opacity: 1,
			y: '0',
			transition: { delay: 0.5 + i * 0.1, ease: [0.76, 0, 0.24, 1] },
		}),
		exit: {
			opacity: 0,
		},
	};

	const menu = {
		visible: { opacity: 1, scale: 1 },
		hidden: { opacity: 0, scale: 0 },
	};

	const variants = {
		open: {
			width: '36rem',
			transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
			opacity: 1,
		},
		closed: {
			width: 0,
			transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
			opacity: 0,
		},
		exit: {
			opacity: 0,
			transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
		},
	};

	useEffect(() => {
		const handleScroll = () => {
			if (scrollY?.current < scrollY?.prev) {
				setHidden(false);
			} else if (scrollY?.current > 300 && scrollY?.current > scrollY?.prev) {
				setHidden(true);
				setIsMenuActive(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div
			className={`${styles.Menu} ${styles[`Menu__${variant}`]} ${className}`}
		>
			<motion.div
				aria-hidden={isMenuActive ? 'false' : 'true'}
				aria-controls="menu"
				variants={menu}
				initial={'hidden'}
				animate={hidden ? 'visible' : 'hidden'}
				transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
			>
				<motion.button
					role="button"
					aria-label="menu"
					aria-hidden={isMenuActive ? 'false' : 'true'}
					whileHover={{ scale: 0.95 }}
					className="menu__button"
					onClick={() => setIsMenuActive(!isMenuActive)}
					transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.3 }}
				>
					<span className={isMenuActive ? 'active' : ''}></span>
					<span className={isMenuActive ? 'active' : ''}></span>
				</motion.button>
				<motion.div className="menu__container">
					<AnimatePresence>
						{isMenuActive && (
							<motion.div
								className="menu__sub-container"
								variants={variants}
								animate={isMenuActive ? 'open' : 'closed'}
								initial={'closed'}
								exit={'closed'}
							>
								<div className="menu__background">
									<Image src={BG} alt="background image of menu" />
								</div>
								<nav className="menu__nav">
									{links.map((link, i) => {
										return (
											<motion.div key={i} style={{ overflow: 'hidden' }}>
												<motion.div
													custom={i}
													variants={animate}
													initial={'initial'}
													exit={'exit'}
													animate={'enter'}
												>
													<motion.a
														whileHover={{ left: '15px' }}
														href={link.href}
													>
														{link.title}
													</motion.a>
												</motion.div>
											</motion.div>
										);
									})}
								</nav>
								<ul className="menu__socials">
									{socials.map((social, i) => {
										return (
											<li key={i} style={{ overflow: 'hidden' }}>
												<motion.div
													custom={i}
													variants={animate}
													initial={'initial'}
													exit={'exit'}
													animate={'enter'}
												>
													<motion.a
														whileHover={{ left: '15px' }}
														href={social.href}
														transition={{
															ease: [0.1, 0.25, 0.3, 1],
															duration: 0.3,
														}}
														target="_blank"
													>
														{social.title}
													</motion.a>
												</motion.div>
											</li>
										);
									})}
								</ul>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</div>
	);
};

Menu.defaultProps = {
	variant: 'default',
	className: '',
};

Menu.propTypes = {
	variant: PropTypes.string,
	className: PropTypes.string,
};

export default Menu;
