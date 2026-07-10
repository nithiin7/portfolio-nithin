'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactElement, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import MenuBackground from 'assets/images/menu-bg.svg';
import { ThemeToggle } from 'components/utilities';
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

const SCROLL_IDLE_DELAY = 150;

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

	const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);

	const scrollIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	useEffect(() => {
		setShowMenu(false);
		setIsMenuActive(false);
	}, [pathname]);

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
			const targetId = href.replace('/#', '');
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				e.preventDefault();
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}

			setIsMenuActive(false);
		}
	};

	/**
	 * Handle backdrop click to close menu.
	 */
	const handleBackdropClick = () => {
		setIsMenuActive(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			if (scrollIdleTimeoutRef.current) {
				clearTimeout(scrollIdleTimeoutRef.current);
			}

			setShowMenu(false);
			if (isMenuActive) setIsMenuActive(false);

			// Never reveal within the first viewport height of scroll.
			if (window.scrollY < window.innerHeight) return;

			scrollIdleTimeoutRef.current = setTimeout(() => {
				setShowMenu(true);
			}, SCROLL_IDLE_DELAY);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (scrollIdleTimeoutRef.current) {
				clearTimeout(scrollIdleTimeoutRef.current);
			}
		};
	}, [isMenuActive]);

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
					aria-hidden={!showMenu}
					aria-controls="menu"
					variants={menu}
					initial={'hidden'}
					animate={showMenu ? 'visible' : 'hidden'}
					transition={{ ease: [0.1, 0.25, 0.3, 1], duration: 0.6 }}
				>
					<div className={styles.menu__controls}>
						<motion.button
							aria-label="Toggle navigation menu"
							aria-expanded={isMenuActive}
							aria-controls="menu-panel"
							aria-hidden={!showMenu}
							tabIndex={showMenu ? 0 : -1}
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
			</nav>
		</>
	);
};

export default Menu;
