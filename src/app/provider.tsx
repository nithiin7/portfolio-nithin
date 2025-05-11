'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import AOS from 'aos';
import { useEffect } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import 'aos/dist/aos.css';
import { init } from 'services/analytics';

interface ProviderProps {
	children: React.ReactNode;
}

export default function Provider({
	children,
}: Readonly<ProviderProps>): React.ReactElement {
	useEffect(() => {
		console.log(
			`
			%c  _______  __    _  __   __  _______  __   __ 
			 |       ||  |  | ||  | |  ||       ||  | |  |
			 |    ___||   |_| ||  |_|  ||   _   ||  |_|  |
			 |   |___ |       ||       ||  | |  ||       |
			 |    ___||  _    ||_     _||  |_|  ||_     _|
			 |   |___ | | |   |  |   |  |       |  |   |  
			 |_______||_|  |__|  |___|  |_______|  |___|  
			`,
			'color: cyan; font-size: 12px;'
		);
		init();
		AOS.init();
	}, []);

	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
			scriptProps={{
				async: false,
				defer: false,
				appendTo: 'head',
				nonce: undefined,
			}}
		>
			<main>
				<ReactLenis root>{children}</ReactLenis>
			</main>
		</GoogleReCaptchaProvider>
	);
}
