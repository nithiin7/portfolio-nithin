'use client';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import MenuBackground from 'assets/images/menu-bg.svg';
import ThemeToggle from 'components/utilities/ThemeToggle';
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

	const { scrollY } = useScroll();

	/**
	 * Animation configuration for the menu items.
	 */
	const animate = {
		initial: {
			opacity: 0,
			y: '100%',
		},
		enter: (i: number) => ({
			opacity: 1,
			y: '0',
			transition: { delay: 0.5 + i * 0.1, ease: [0.76, 0, 0.24, 1] },
		}),
		exit: {
			opacity: 0,
		},
	};

	/**
	 * Animation states for the menu visibility.
	 */
	const menu = {
		visible: { opacity: 1, scale: 1 },
		hidden: { opacity: 0, scale: 0 },
	};

	/**
	 * Animation variants for opening and closing the menu container.
	 */
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
		/**
		 * Handles scroll behavior to toggle the menu's visibility based on scroll direction.
		 */
		const handleScroll = () => {
			const currentScrollY = scrollY.get();
			const prevScrollY = prevScrollYRef.current;

			if (currentScrollY < prevScrollY) {
				setHidden(false);
			} else if (currentScrollY > 300 && currentScrollY > prevScrollY) {
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
		<nav
			className={[styles.menu, styles[`menu__${variant}`], className].join(' ')}
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
						aria-label="menu"
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
								className={styles['menu__sub-container']}
								variants={variants}
								animate={isMenuActive ? 'open' : 'closed'}
								initial={'closed'}
								exit={'closed'}
							>
								<ThemeToggle className={styles['menu__toggle-inmenu']} />
								<div className={styles.menu__background}>
									<MenuBackground />
								</div>
								<div className={styles.menu__nav}>
									{links.map((link, i) => {
										return (
											<motion.div
												key={`${link.title}-${i}`}
												style={{ overflow: 'hidden' }}
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
														href={link.href}
													>
														{link.title}
													</motion.a>
												</motion.div>
											</motion.div>
										);
									})}
								</div>
								<ul className={styles.menu__socials}>
									{socialsMenu.map((social, i) => {
										return (
											<li
												key={`${social.title}-${i}`}
												style={{ overflow: 'hidden' }}
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

export default Menu;
