import PropTypes from 'prop-types';
import loadData from 'helpers/contentful';
import { GoogleAnalytics } from '@next/third-parties/google';

import 'styles/globals.scss';

import Provider from './provider';
import Navbar from 'components/layouts/Navbar';
import Footer from 'components/layouts/Footer';

export async function generateMetadata() {
	const props = await loadData();
	const path = props?.data.pageCollection.items[0];

	return {
		title: path.title,
		description: path.description,
		openGraph: {
			title: path.ogtitle,
			description: path.description,
		},
	};
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Provider>
					<Navbar />
					{children}
					<Footer />
				</Provider>
				<GoogleAnalytics gaId="G-E4KM0WS03X" />
			</body>
		</html>
	);
}

RootLayout.propTypes = {
	children: PropTypes.object.isRequired,
};
