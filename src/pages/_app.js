import Head from 'next/head';
import { useEffect } from 'react';

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
