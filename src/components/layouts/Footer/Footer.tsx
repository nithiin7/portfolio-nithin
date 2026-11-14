import Link from 'next/link';
import type { ReactElement } from 'react';

import CopyText from 'components/utilities/CopyText/CopyText';
import LocalClock from 'components/utilities/LocalClock/LocalClock';
import { navLinks, EXTERNAL_ARROW } from 'constants/index';
import type { SiteSettings } from 'types/site';

import styles from './Footer.module.scss';
import FooterBackToTop from './FooterBackToTop';
import FooterFrame from './FooterFrame';
import FooterHeadline from './FooterHeadline';

const ZONE_LABEL = 'IST';

interface FooterProps {
	site: SiteSettings;
}

/** Site footer: headline, contact links, local time and back-to-top. */
const Footer = ({ site }: FooterProps): ReactElement => {
	const { email, location, availability, name, socials } = site;

	const extended = (
		<>
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

			<div className={styles.Footer__details}>
				<div className={styles.Footer__cell} data-cell="email">
					<p className={styles.Footer__label}>Email</p>
					<CopyText
						text={email}
						label="Email"
						className={styles.Footer__email}
					/>
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
							<li key={social.url}>
								<a
									href={social.url}
									className={styles.Footer__link}
									target="_blank"
									rel="noopener noreferrer"
								>
									{social.label}
									<span className={styles.Footer__srOnly}>
										{' '}
										(opens in a new tab)
									</span>
									<span aria-hidden="true" className={styles.Footer__arrow}>
										{' '}
										{EXTERNAL_ARROW}
									</span>
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
		</>
	);

	return (
		<FooterFrame extended={extended}>
			<div className={styles.Footer__bar}>
				<small suppressHydrationWarning>
					© {new Date().getFullYear()} {name}
				</small>
				<FooterBackToTop />
			</div>
		</FooterFrame>
	);
};

export default Footer;
