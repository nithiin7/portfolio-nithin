'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion, useScroll } from 'framer-motion';

import styles from './Menu.module.scss';
import MenuBackground from 'assets/images/menu-bg.svg';
import { links, socialsMenu } from 'helpers/constants';

const Menu = (props) => {
	const { className, variant } = props;

	const [isMenuActive, setIsMenuActive] = useState(false);
	const [hidden, setHidden] = useState(false);

	const { scrollY } = useScroll();

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
		<nav
			className={`${styles.Menu} ${styles[`Menu__${variant}`]} ${className}`}
		>
			<motion.div
				aria-hidden={!isMenuActive}
				aria-controls="menu"
				variants={menu}
				initial={'hidden'}
				animate={hidden ? 'visible' : 'hidden'}
				transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
			>
				<motion.button
					aria-label="menu"
					aria-hidden={!isMenuActive}
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
									<MenuBackground />
								</div>
								<div className="menu__nav">
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
								</div>
								<ul className="menu__socials">
									{socialsMenu.map((social, i) => {
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
														rel="noopener noreferrer"
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
		</nav>
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
