'use client';
import { useLenis } from 'lenis/react';
import type { Transition } from 'motion/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import LocalClock from 'components/utilities/LocalClock/LocalClock';
import ThemeToggle from 'components/utilities/ThemeToggle/ThemeToggle';
import { MENU_SOCIALS, navLinks } from 'constants/index';
import { useSiteSettings } from 'contexts/SiteSettingsContext';
import {
	useFocusTrap,
	useKeyboardNavigation,
} from 'hooks/useKeyboardNavigation';
import { duration, ease } from 'styles/tokens';

import styles from './Menu.module.scss';

export interface MenuProps {
	open: boolean;
	/** `restoreFocus` is true when closed via Escape or the close button. */
	onClose: (restoreFocus: boolean) => void;
	onLinkClick: (href: string, e: MouseEvent<HTMLAnchorElement>) => void;
}

const panelTransition: Transition = { duration: duration.base, ease };

/**
 * Full-screen menu overlay. Controlled by Navbar; traps focus, closes on
 * Escape, and pauses Lenis while open.
 */
const Menu = ({ open, onClose, onLinkClick }: MenuProps): ReactElement => {
	const { socials, location } = useSiteSettings();
	const menuSocials = MENU_SOCIALS.flatMap((icon) =>
		socials.filter((social) => social.icon === icon)
	);
	const lenis = useLenis();
	const reduceMotion = useReducedMotion();
	const closeRef = useRef<HTMLButtonElement>(null);

	const handleEscape = useCallback(() => onClose(true), [onClose]);
	const keyboardRef = useKeyboardNavigation({
		onEscape: handleEscape,
		enabled: open,
	});
	const trapRef = useFocusTrap(open);

	const setPanelRef = useCallback(
		(node: HTMLDivElement | null) => {
			keyboardRef.current = node;
			trapRef.current = node;
		},
		[keyboardRef, trapRef]
	);

	useEffect(() => {
		if (!open) return;
		lenis?.stop();
		closeRef.current?.focus();
		return () => lenis?.start();
	}, [open, lenis]);

	const panelMotion = reduceMotion
		? {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
			}
		: {
				initial: { clipPath: 'inset(0 0 100% 0)' },
				animate: { clipPath: 'inset(0 0 0% 0)' },
				exit: { clipPath: 'inset(0 0 100% 0)' },
			};

	const itemMotion = (i: number) =>
		reduceMotion
			? {}
			: {
					initial: { y: '110%' },
					animate: {
						y: '0%',
						transition: {
							duration: duration.base,
							ease,
							delay: 0.2 + i * 0.06,
						},
					},
				};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					ref={setPanelRef}
					id="menu-panel"
					role="dialog"
					aria-modal="true"
					aria-label="Navigation menu"
					className={styles.Menu}
					transition={panelTransition}
					{...panelMotion}
				>
					<div className={styles.Menu__bar}>
						<span className={styles.Menu__logo} aria-hidden="true">
							NP
							<span className={styles.Menu__dot} />
						</span>
						<button
							ref={closeRef}
							type="button"
							className={styles.Menu__close}
							onClick={() => onClose(true)}
						>
							Close
						</button>
					</div>

					<nav className={styles.Menu__nav} aria-label="Menu">
						<ol className={styles.Menu__list}>
							{navLinks.map((link, i) => (
								<li key={link.href} className={styles.Menu__item}>
									<motion.span
										className={styles.Menu__itemInner}
										{...itemMotion(i)}
									>
										<span className={styles.Menu__index} aria-hidden="true">
											{String(i + 1).padStart(2, '0')}
										</span>
										<Link
											href={link.href}
											className={styles.Menu__link}
											onClick={(e) => onLinkClick(link.href, e)}
										>
											{link.title}
										</Link>
									</motion.span>
								</li>
							))}
						</ol>
					</nav>

					<div className={styles.Menu__footer}>
						<ul className={styles.Menu__socials} aria-label="Social links">
							{menuSocials.map((social) => (
								<li key={social.url}>
									<a
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										{social.label}
										<span className={styles.Menu__srOnly}>
											{' '}
											(opens in a new tab)
										</span>
									</a>
								</li>
							))}
						</ul>
						<p className={styles.Menu__meta}>
							{location.city}{' '}
							<LocalClock
								timeZone={location.timeZone}
								zoneLabel="IST"
								showSeconds={false}
							/>
						</p>
						<ThemeToggle className={styles.Menu__theme} />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Menu;
