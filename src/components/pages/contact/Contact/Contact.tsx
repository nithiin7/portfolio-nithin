'use client';
import type { FC } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { RevealText } from 'components/motion';
import { ContactForm } from 'components/pages';
import { CopyEmail, LocalClock } from 'components/utilities';
import { siteConfig } from 'config/site';
import { contactOptions, socials } from 'constants/index';
import { clientEnv } from 'helpers/env';

import styles from './Contact.module.scss';

const TITLE = 'Say no more. Let’s bring your project to life.';

const Contact: FC = () => {
	const { email, location, availability } = siteConfig;
	const directLines = contactOptions.filter(
		(option) => !option.link.startsWith('mailto:')
	);

	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={clientEnv.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
			scriptProps={{
				async: true,
				defer: true,
				appendTo: 'body',
				nonce: undefined,
			}}
		>
			<div className={styles.Contact}>
				<header className={styles.Contact__head}>
					<p className={styles.Contact__label}>Contact</p>
					<RevealText as="h1" trigger="mount" className={styles.Contact__title}>
						{TITLE}
					</RevealText>
				</header>

				<div className={styles.Contact__body}>
					<div className={styles.Contact__form}>
						<ContactForm />
					</div>

					<aside
						className={styles.Contact__aside}
						aria-label="Other ways to reach me"
					>
						<dl className={styles.Contact__details}>
							<div className={styles.Contact__row}>
								<dt className={styles.Contact__label}>Email</dt>
								<dd>
									<CopyEmail email={email} className={styles.Contact__email} />
								</dd>
							</div>

							{directLines.map((option) => (
								<div key={option.link} className={styles.Contact__row}>
									<dt className={styles.Contact__label}>{option.label}</dt>
									<dd>
										<a
											href={option.link}
											className={styles.Contact__link}
											target="_blank"
											rel="noopener noreferrer"
										>
											{option.subtitle}
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
											<li key={social.title}>
												<a
													href={social.link}
													className={styles.Contact__link}
													target="_blank"
													rel="noopener noreferrer"
												>
													{social.title}
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
		</GoogleReCaptchaProvider>
	);
};

export default Contact;
