'use client';
import { useLenis } from 'lenis/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';

import CopyEmail from 'components/utilities/CopyEmail/CopyEmail';
import LocalClock from 'components/utilities/LocalClock/LocalClock';
import { siteConfig } from 'config/site';
import { navLinks, socials } from 'constants/index';
import { usePrefersReducedMotion } from 'hooks/usePrefersReducedMotion';

import styles from './Footer.module.scss';
import FooterHeadline from './FooterHeadline';

const ZONE_LABEL = 'IST';

/**
 * Global footer. Everywhere except /contact it opens with the giant
 * "GET IN TOUCH" CTA and a details row (email, local time, socials, index);
 * /contact already presents all of that, so it only gets the closing bar.
 */
const Footer = (): ReactElement => {
	const pathname = usePathname();
	const lenis = useLenis();
	const reduced = usePrefersReducedMotion();
	const { email, location, availability, name } = siteConfig;
	const full = pathname !== '/contact';

	const backToTop = (): void => {
		if (lenis) lenis.scrollTo(0, { immediate: reduced });
		else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
		// Keyboard users land at the top of the document, not on the footer
		document.getElementById('main-content')?.focus({ preventScroll: true });
	};

	return (
		<footer className={styles.Footer} data-variant={full ? 'full' : 'compact'}>
			{full && (
				<section className={styles.Footer__cta} aria-labelledby="footer-title">
					<div className={styles.Footer__intro}>
						<p className={styles.Footer__label}>Next step</p>
						<p className={styles.Footer__lede}>
							Got a project? Need an <em>unfair advantage</em>?
						</p>
						<p className={styles.Footer__status}>
							<span
								className={styles.Footer__dot}
								data-open={availability.open}
								aria-hidden="true"
							/>
							{availability.label}
						</p>
					</div>
					<h2 id="footer-title" className={styles.Footer__srOnly}>
						Get in touch
					</h2>
					<FooterHeadline />
				</section>
			)}

			{full && (
				<div className={styles.Footer__details}>
					<div className={styles.Footer__cell} data-cell="email">
						<p className={styles.Footer__label}>Email</p>
						<CopyEmail email={email} className={styles.Footer__email} />
					</div>

					<div className={styles.Footer__cell} data-cell="time">
						<p className={styles.Footer__label}>Local time</p>
						<p className={styles.Footer__value}>
							<LocalClock
								timeZone={location.timeZone}
								zoneLabel={ZONE_LABEL}
								showSeconds={false}
							/>
							<br />
							{location.city}, {location.country}
						</p>
					</div>

					<nav
						className={styles.Footer__cell}
						data-cell="socials"
						aria-label="Social profiles"
					>
						<p className={styles.Footer__label}>Elsewhere</p>
						<ul className={styles.Footer__list}>
							{socials.map((social) => (
								<li key={social.title}>
									<a
										href={social.link}
										className={styles.Footer__link}
										target="_blank"
										rel="noopener noreferrer"
									>
										{social.title}
										<span className={styles.Footer__srOnly}>
											{' '}
											(opens in a new tab)
										</span>
										<span aria-hidden="true"> ↗</span>
									</a>
								</li>
							))}
						</ul>
					</nav>

					<nav
						className={styles.Footer__cell}
						data-cell="index"
						aria-label="Footer"
					>
						<p className={styles.Footer__label}>Index</p>
						<ul className={styles.Footer__list}>
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className={styles.Footer__link}>
										{link.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			)}

			<div className={styles.Footer__bar}>
				<small suppressHydrationWarning>
					© {new Date().getFullYear()} {name}
				</small>
				<button
					type="button"
					className={styles.Footer__top}
					onClick={backToTop}
				>
					<span className={styles.Footer__underline}>Back to top</span>
					<span aria-hidden="true">↑</span>
				</button>
			</div>
		</footer>
	);
};

export default Footer;
