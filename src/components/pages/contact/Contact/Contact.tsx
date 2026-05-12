'use client';
import Link from 'next/link';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { FiArrowLeft } from 'react-icons/fi';

import { ContactForm } from 'components/pages';
import { MaskText } from 'components/utilities';
import { contactOptions } from 'constants/index';

import styles from './Contact.module.scss';

const Contact: React.FC = () => {
	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
			scriptProps={{
				async: true,
				defer: true,
				appendTo: 'body',
				nonce: undefined,
			}}
		>
			<div className={styles.contact}>
				<Link href="/" className={styles.contact__backButton}>
					<FiArrowLeft size={16} />
					<span>Back to Home</span>
				</Link>
				<div className={styles.contact__inner}>
					<div className={styles.contact__grid}>
						<div className={styles.contact__left}>
							<h1>
								<MaskText
									phrases={['Say No More. Lets Bring your project to life']}
								/>
							</h1>
							<div className={styles.contact__socials}>
								<p className={styles.contact__socialsLabel}>
									Further Enquiries or Collaboration
								</p>
								{contactOptions.map((option, index) => (
									<div
										key={`${option.subtitle}-${index}`}
										className={styles.contact__link}
									>
										<Link href={option.link} title={option.subtitle}>
											{option.subtitle}
										</Link>
									</div>
								))}
							</div>
						</div>
						<div className={styles.contact__right}>
							<ContactForm />
						</div>
					</div>
				</div>
			</div>
		</GoogleReCaptchaProvider>
	);
};

export default Contact;
