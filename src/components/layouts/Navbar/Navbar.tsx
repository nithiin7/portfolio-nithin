'use client';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import Menu from 'components/layouts/Menu/Menu';
import { navLinks } from 'constants/index';
import { useSiteSettings } from 'contexts/SiteSettingsContext';
import { handleScroll } from 'helpers/scroll';
import { useScrollDirection } from 'hooks/useScrollDirection';

import styles from './Navbar.module.scss';

export interface NavbarProps {
	className?: string;
}

const isActive = (pathname: string, href: string): boolean =>
	!href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`));

/**
 * Sticky site nav: hides on scroll down, returns on scroll up, and owns the
 * full-screen Menu overlay (the only nav on small screens).
 */
const Navbar = ({ className = '' }: NavbarProps): ReactElement => {
	const { name } = useSiteSettings();
	const pathname = usePathname();
	const lenis = useLenis();
	const { isVisible, isAtTop } = useScrollDirection();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	const closeMenu = useCallback((restoreFocus: boolean) => {
		setIsMenuOpen(false);
		if (restoreFocus) toggleRef.current?.focus();
	}, []);

	const handleLinkClick = useCallback(
		(href: string, e: MouseEvent<HTMLAnchorElement>) => {
			if (pathname === '/' && href.startsWith('/#')) {
				e.preventDefault();
				handleScroll(href.slice(2), lenis);
			}
			setIsMenuOpen(false);
		},
		[pathname, lenis]
	);

	return (
		<>
			<header
				className={[styles.Navbar, className].join(' ')}
				data-navbar
				data-hidden={!isVisible && !isMenuOpen}
				data-at-top={isAtTop}
			>
				<div className={styles.Navbar__inner}>
					<Link
						href="/"
						className={styles.Navbar__logo}
						aria-label={`NP, ${name}, home`}
					>
						NP
						<span className={styles.Navbar__dot} aria-hidden="true" />
					</Link>
					<nav className={styles.Navbar__nav} aria-label="Primary">
						<ul className={styles.Navbar__list}>
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className={styles.Navbar__link}
										aria-current={
											isActive(pathname, link.href) ? 'page' : undefined
										}
										onClick={(e) => handleLinkClick(link.href, e)}
									>
										{link.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<button
						ref={toggleRef}
						type="button"
						className={styles.Navbar__toggle}
						aria-expanded={isMenuOpen}
						aria-controls={isMenuOpen ? 'menu-panel' : undefined}
						onClick={() => setIsMenuOpen((open) => !open)}
					>
						<span className={styles.Navbar__toggleText}>Menu</span>
						<span className={styles.Navbar__toggleIcon} aria-hidden="true" />
					</button>
				</div>
			</header>
			<Menu
				open={isMenuOpen}
				onClose={closeMenu}
				onLinkClick={handleLinkClick}
			/>
		</>
	);
};

export default Navbar;
