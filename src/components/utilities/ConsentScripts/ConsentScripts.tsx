'use client';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import type { ReactElement } from 'react';

import { useConsent } from 'contexts/ConsentContext';

const gtmSnippet = (id: string): string =>
	`(function(w,d,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;d.head.appendChild(j);})(window,document,'dataLayer','${id}');`;

interface ConsentScriptsProps {
	gtmId?: string;
	vercel: boolean;
}

/** Analytics scripts, mounted only once the visitor opts in. */
const ConsentScripts = ({
	gtmId,
	vercel,
}: ConsentScriptsProps): ReactElement | null => {
	const { analytics } = useConsent();
	if (!analytics) return null;

	return (
		<>
			{vercel && (
				<>
					<Analytics />
					<SpeedInsights />
				</>
			)}
			{gtmId && (
				<Script id="gtm" strategy="lazyOnload">
					{gtmSnippet(gtmId)}
				</Script>
			)}
		</>
	);
};

export default ConsentScripts;
