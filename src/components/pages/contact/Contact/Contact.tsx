import type { FC } from 'react';

import RevealText from 'components/motion/RevealText/RevealText';
import ContactForm from 'components/pages/contact/ContactForm/ContactForm';
import CopyText from 'components/utilities/CopyText/CopyText';
import LocalClock from 'components/utilities/LocalClock/LocalClock';
import type { SiteSettings } from 'types/site';

import styles from './Contact.module.scss';
import ContactRecaptcha from './ContactRecaptcha';

const TITLE = 'Say no more. Let’s bring your project to life.';

interface ContactProps {
	site: SiteSettings;
}

/** Contact page: contact channels, local time and the form. */
const Contact: FC<ContactProps> = ({ site }) => {
	const { email, location, availability, socials } = site;
	const directLines = site.contactChannels.filter(
		(option) => !option.url.startsWith('mailto:')
	);

	return (
		<div className={styles.Contact}>
			<header className={styles.Contact__head}>
				<p className={styles.Contact__label}>Contact</p>
				<RevealText as="h1" trigger="mount" className={styles.Contact__title}>
					{TITLE}
				</RevealText>
			</header>

			<div className={styles.Contact__body}>
				<div className={styles.Contact__form}>
					<ContactRecaptcha>
						<ContactForm />
					</ContactRecaptcha>
				</div>

				<aside
					className={styles.Contact__aside}
					aria-label="Other ways to reach me"
				>
					<dl className={styles.Contact__details}>
						<div className={styles.Contact__row}>
							<dt className={styles.Contact__label}>Email</dt>
							<dd>
								<CopyText
									text={email}
									label="Email"
									className={styles.Contact__email}
								/>
							</dd>
						</div>

						{directLines.map((option) => (
							<div key={option.url} className={styles.Contact__row}>
								<dt className={styles.Contact__label}>{option.label}</dt>
								<dd>
									<a
										href={option.url}
										className={styles.Contact__link}
										target="_blank"
										rel="noopener noreferrer"
									>
										{option.detail ?? option.label}
										<span className={styles.Contact__srOnly}>
											{' '}
											(opens in a new tab)
										</span>
									</a>
								</dd>
							</div>
						))}

						<div className={styles.Contact__row}>
							<dt className={styles.Contact__label}>Local time</dt>
							<dd>
								<LocalClock
									timeZone={location.timeZone}
									zoneLabel="IST"
									showSeconds={false}
								/>{' '}
								· {location.city}
							</dd>
						</div>

						<div className={styles.Contact__row}>
							<dt className={styles.Contact__label}>Status</dt>
							<dd>
								<span
									className={styles.Contact__dot}
									data-open={availability.open}
									aria-hidden="true"
								/>
								{availability.label}
							</dd>
						</div>

						<div className={styles.Contact__row}>
							<dt className={styles.Contact__label}>Elsewhere</dt>
							<dd>
								<ul className={styles.Contact__socials}>
									{socials.map((social) => (
										<li key={social.url}>
											<a
												href={social.url}
												className={styles.Contact__link}
												target="_blank"
												rel="noopener noreferrer"
											>
												{social.label}
												<span className={styles.Contact__srOnly}>
													{' '}
													(opens in a new tab)
												</span>
											</a>
										</li>
									))}
								</ul>
							</dd>
						</div>
					</dl>
				</aside>
			</div>
		</div>
	);
};

export default Contact;
