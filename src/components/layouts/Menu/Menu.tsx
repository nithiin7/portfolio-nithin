'use client';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactElement, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import MenuBackground from 'assets/images/menu-bg.svg';
import { ColorMaskButton, ThemeToggle } from 'components/utilities';
import { links, socialsMenu } from 'constants/index';
import {
	animate,
	backdropVariants,
	backgroundVariants,
	menu,
	variants,
} from 'helpers/animations';
import {
	useKeyboardNavigation,
	useFocusTrap,
} from 'hooks/useKeyboardNavigation';

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
	const pathname = usePathname();
	const isHomePage = pathname === '/';
	const isContactPage = pathname === '/contact';

	const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
	const [hidden, setHidden] = useState<boolean>(!isHomePage);

	const prevScrollYRef = useRef(0);

	useEffect(() => {
		setHidden(!isHomePage);
		setIsMenuActive(false);
	}, [isHomePage]);

	const menuRef = useKeyboardNavigation({
		onEscape: () => setIsMenuActive(false),
		enabled: isMenuActive,
	});

	const menuContainerRef = useFocusTrap(isMenuActive);

	/**
	 * Handles smooth scrolling to sections when navigation links are clicked.
	 * @param {string} href - The href attribute of the clicked link
	 * @param {MouseEvent<HTMLAnchorElement>} e - The click event
	 */
	const handleNavClick = (href: string, e: MouseEvent<HTMLAnchorElement>) => {
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
	 * Handle backdrop click to close menu.
	 */
	const handleBackdropClick = () => {
		setIsMenuActive(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = scrollY.get();
			const prevScrollY = prevScrollYRef.current;
			const viewportHeight = window.innerHeight;

			if (isHomePage) {
				// Homepage: only reveal after scrolling past the hero, hide when scrolling back up
				if (currentScrollY < prevScrollY) {
					setHidden(false);
				} else if (
					currentScrollY > viewportHeight &&
					currentScrollY > prevScrollY
				) {
					setHidden(true);
					if (isMenuActive) setIsMenuActive(false);
				}
			} else {
				// Other pages: standard sticky behaviour — hide on scroll down, show on scroll up
				if (currentScrollY <= 50 || currentScrollY < prevScrollY) {
					setHidden(true);
				} else if (currentScrollY > 50 && currentScrollY > prevScrollY) {
					setHidden(false);
					if (isMenuActive) setIsMenuActive(false);
				}
			}

			prevScrollYRef.current = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [scrollY, isMenuActive, isHomePage]);

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
				ref={menuRef}
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
									ref={menuContainerRef}
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
									<div className={styles.menu__controls}>
										<ThemeToggle className={styles['menu__toggle-inmenu']} />
									</div>
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
																onClick={(e) => handleNavClick(link.href, e)}
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
					aria-hidden={hidden || isContactPage}
					aria-controls="menu"
					variants={menu}
					initial={'hidden'}
					animate={hidden && !isContactPage ? 'visible' : 'hidden'}
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
