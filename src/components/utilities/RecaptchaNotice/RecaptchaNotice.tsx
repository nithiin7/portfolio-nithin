import type { ReactElement } from 'react';

import styles from './RecaptchaNotice.module.scss';

interface RecaptchaNoticeProps {
	className?: string;
}

/** Google's required reCAPTCHA attribution, shown instead of the badge. */
const RecaptchaNotice = ({ className }: RecaptchaNoticeProps): ReactElement => (
	<p className={[styles.RecaptchaNotice, className].filter(Boolean).join(' ')}>
		This site is protected by reCAPTCHA and the Google{' '}
		<a
			className={styles.RecaptchaNotice__link}
			href="https://policies.google.com/privacy"
			target="_blank"
			rel="noopener noreferrer"
		>
			Privacy Policy
		</a>{' '}
		and{' '}
		<a
			className={styles.RecaptchaNotice__link}
			href="https://policies.google.com/terms"
			target="_blank"
			rel="noopener noreferrer"
		>
			Terms of Service
		</a>{' '}
		apply.
	</p>
);

export default RecaptchaNotice;
