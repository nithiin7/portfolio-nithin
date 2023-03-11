import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Layout from 'components/layouts/Layout';
import 'styles/globals.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function App({ Component, pageProps }) {
	useEffect(() => {
		AOS.init();
	}, []);
	return (
		<Layout {...pageProps}>
			<Component {...pageProps} />
		</Layout>
	);
}

App.propTypes = {
	Component: PropTypes.func.isRequired,
	pageProps: PropTypes.object.isRequired,
};
