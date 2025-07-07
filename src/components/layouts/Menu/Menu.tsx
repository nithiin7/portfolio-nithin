'use client';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import MenuBackground from 'assets/images/menu-bg.svg';
import { ColorMaskButton, ThemeToggle } from 'components/utilities';
import { links, socialsMenu } from 'constants/index';

import styles from './Menu.module.scss';

export interface MenuProps {
	className?: string;
	variant?: 'default' | 'alternative';
}

/**
 * Menu component with animated navigation links, social icons, and scroll detection.
 * Includes a toggle button to activate/deactivate the menu and dynamically shows or hides based on scroll.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for styling.
 * @param {'default' | 'alternative'} [variant='default'] - Visual variant of the menu.
 * @returns {JSX.Element} The rendered Menu component.
 */
const Menu = ({
	className = '',
	variant = 'default',
}: MenuProps): ReactElement => {
	const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
	const [hidden, setHidden] = useState<boolean>(false);

	const prevScrollYRef = useRef(0);

	/**
	 * Handles smooth scrolling to sections when navigation links are clicked.
	 * @param {string} href - The href attribute of the clicked link
	 * @param {MouseEvent} e - The click event
	 */
	const handleNavClick = (href: string, e: MouseEvent) => {
		if (href.startsWith('/#')) {
			e.preventDefault();
			const targetId = href.replace('/#', '');
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});

				setIsMenuActive(false);
			}
		}
	};

	const { scrollY } = useScroll();

	/**
	 * Animation configuration for the menu items.
	 */
	const animate = {
		initial: {
			opacity: 0,
			y: '100%',
			scale: 0.8,
		},
		enter: (i: number) => ({
			opacity: 1,
			y: '0',
			scale: 1,
			transition: {
				delay: 0.3 + i * 0.08,
				ease: [0.76, 0, 0.24, 1],
				duration: 0.6,
			},
		}),
		exit: {
			opacity: 0,
			y: '50%',
			scale: 0.9,
			transition: {
				ease: [0.76, 0, 0.24, 1],
				duration: 0.4,
			},
		},
	};

	/**
	 * Animation states for the menu visibility.
	 */
	const menu = {
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				ease: [0.76, 0, 0.24, 1],
				duration: 0.6,
			},
		},
		hidden: {
			opacity: 0,
			scale: 0,
			transition: {
				ease: [0.76, 0, 0.24, 1],
				duration: 0.4,
			},
		},
	};

	/**
	 * Animation variants for opening and closing the menu container.
	 */
	const variants = {
		open: {
			width: '36rem',
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.75,
				ease: [0.76, 0, 0.24, 1],
				opacity: { delay: 0.1, duration: 0.4 },
				scale: { delay: 0.05, duration: 0.5 },
			},
		},
		closed: {
			width: 0,
			opacity: 0,
			scale: 0.95,
			transition: {
				duration: 0.75,
				ease: [0.76, 0, 0.24, 1],
				opacity: { duration: 0.3 },
				scale: { duration: 0.4 },
			},
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			transition: {
				duration: 0.5,
				ease: [0.76, 0, 0.24, 1],
			},
		},
	};

	/**
	 * Animation variants for the backdrop overlay.
	 */
	const backdropVariants = {
		open: {
			opacity: 1,
			backdropFilter: 'blur(8px)',
			transition: {
				duration: 0.4,
				ease: [0.76, 0, 0.24, 1],
				backdropFilter: { delay: 0.1, duration: 0.3 },
			},
		},
		closed: {
			opacity: 0,
			backdropFilter: 'blur(0px)',
			transition: {
				duration: 0.3,
				ease: [0.76, 0, 0.24, 1],
			},
		},
	};

	/**
	 * Animation for the background decoration.
	 */
	const backgroundVariants = {
		initial: {
			opacity: 0,
			scale: 0.8,
			rotate: -10,
		},
		enter: {
			opacity: 0.25,
			scale: 1,
			rotate: 0,
			transition: {
				delay: 0.4,
				duration: 0.8,
				ease: [0.76, 0, 0.24, 1],
			},
		},
		exit: {
			opacity: 0,
			scale: 0.8,
			rotate: 10,
			transition: {
				duration: 0.4,
				ease: [0.76, 0, 0.24, 1],
			},
		},
	};

	/**
	 * Handle backdrop click to close menu.
	 */
	const handleBackdropClick = () => {
		setIsMenuActive(false);
	};

	useEffect(() => {
		/**
		 * Handles scroll behavior to toggle the menu's visibility based on scroll direction.
		 */
		const handleScroll = () => {
			const currentScrollY = scrollY.get();
			const prevScrollY = prevScrollYRef.current;
			const viewportHeight = window.innerHeight;

			if (currentScrollY < prevScrollY) {
				setHidden(false);
			} else if (
				currentScrollY > viewportHeight &&
				currentScrollY > prevScrollY
			) {
				setHidden(true);
				if (isMenuActive) {
					setIsMenuActive(false);
				}
			}

			prevScrollYRef.current = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [scrollY, isMenuActive]);

	return (
		<>
			<AnimatePresence>
				{isMenuActive && (
					<motion.div
						className={styles.menu__backdrop}
						variants={backdropVariants}
						initial="closed"
						animate="open"
						exit="closed"
						onClick={handleBackdropClick}
						role="presentation"
						aria-hidden="true"
					/>
				)}
			</AnimatePresence>
			<nav
				className={[styles.menu, styles[`menu__${variant}`], className].join(
					' '
				)}
				role="navigation"
				aria-label="Main navigation"
			>
				<motion.div
					aria-hidden={hidden}
					aria-controls="menu"
					variants={menu}
					initial={'hidden'}
					animate={hidden ? 'visible' : 'hidden'}
					transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
				>
					<div className={styles.menu__controls}>
						<motion.button
							aria-label="Toggle navigation menu"
							aria-expanded={isMenuActive}
							aria-controls="menu-panel"
							aria-hidden={hidden}
							tabIndex={hidden ? -1 : 0}
							whileHover={{ scale: 0.95 }}
							className={styles.menu__button}
							onClick={() => setIsMenuActive(!isMenuActive)}
							transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.3 }}
						>
							<motion.span
								animate={
									isMenuActive ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }
								}
								transition={{ duration: 0.3 }}
							/>
							<motion.span
								animate={
									isMenuActive ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }
								}
								transition={{ duration: 0.3 }}
							/>
						</motion.button>
					</div>
					<motion.div className={styles.menu__container}>
						<AnimatePresence>
							{isMenuActive && (
								<motion.div
									id="menu-panel"
									role="dialog"
									aria-modal="true"
									aria-label="Navigation menu"
									className={styles['menu__sub-container']}
									variants={variants}
									animate={isMenuActive ? 'open' : 'closed'}
									initial={'closed'}
									exit={'closed'}
								>
									<ThemeToggle className={styles['menu__toggle-inmenu']} />
									<motion.div
										className={styles.menu__background}
										variants={backgroundVariants}
										initial="initial"
										animate="enter"
										exit="exit"
									>
										<MenuBackground />
									</motion.div>
									<nav
										className={styles.menu__nav}
										role="navigation"
										aria-label="Main menu"
									>
										<ul role="list">
											{links.map((link, i) => {
												return (
													<motion.li key={`${link.title}-${i}`} role="listitem">
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
																role="menuitem"
																onClick={(e) =>
																	handleNavClick(link.href, e as any)
																}
															>
																{link.title}
															</motion.a>
														</motion.div>
													</motion.li>
												);
											})}
										</ul>
									</nav>
									<nav
										className={styles.menu__socials}
										role="navigation"
										aria-label="Social media links"
									>
										<ul role="list">
											{socialsMenu.map((social, i) => {
												return (
													<li
														key={`${social.title}-${i}`}
														style={{ overflow: 'hidden' }}
														role="listitem"
													>
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
																aria-label={`Visit ${social.title} on social media`}
															>
																{social.title}
															</motion.a>
														</motion.div>
													</li>
												);
											})}
										</ul>
									</nav>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</motion.div>
				<motion.div
					className={styles.menu__book}
					variants={menu}
					initial={'hidden'}
					animate={hidden ? 'visible' : 'hidden'}
					transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
				>
					<ColorMaskButton
						className={styles.menu__bookCall}
						variant="default"
						href="/contact"
					/>
				</motion.div>
			</nav>
		</>
	);
};

export default Menu;
