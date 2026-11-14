'use client';
import type { ReactElement, ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { clientEnv } from 'helpers/env';

interface ContactRecaptchaProps {
	children: ReactNode;
}

/** Provides reCAPTCHA v3 to the contact form. */
const ContactRecaptcha = ({
	children,
}: ContactRecaptchaProps): ReactElement => (
	<GoogleReCaptchaProvider
		reCaptchaKey={clientEnv.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
		scriptProps={{ async: true, defer: true, appendTo: 'body' }}
	>
		{children}
	</GoogleReCaptchaProvider>
);

export default ContactRecaptcha;
