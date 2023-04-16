import Head from 'next/head';
import { useEffect } from 'react';
import Script from 'next/script';

import PropTypes from 'prop-types';
import Layout from 'components/layouts/Layout';
import AOS from 'aos';

import 'styles/globals.scss';
import 'aos/dist/aos.css';

export default function App({ Component, pageProps }) {
	useEffect(() => {
		AOS.init();
	}, []);
	
	return (
		<>
			<Head>
				<link rel="icon" href="/images/favicon.ico" />
				<link
					rel="np-icon"
					sizes="180x180"
					href="/images/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/images/favicon.png"
				/>
				<Script
					strategy="lazyOnload"
					src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
					/>

					<Script id="ga-script" strategy="lazyOnload">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}', {
						page_path: window.location.pathname,
						});
							`}
				</Script>
			</Head>
			<Layout {...pageProps}>
				<Component {...pageProps} />
			</Layout>
		</>
	);
}

App.propTypes = {
	Component: PropTypes.func.isRequired,
	pageProps: PropTypes.object.isRequired,
};
