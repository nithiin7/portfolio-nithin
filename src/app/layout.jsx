import PropTypes from 'prop-types';
import loadData from 'helpers/contentful';
import { GoogleAnalytics } from '@next/third-parties/google';

import 'styles/globals.scss';

import Provider from './provider';
import Footer from 'components/layouts/Footer';
import Curve from './transition';
import Menu from 'components/layouts/Menu/Menu';

export async function generateMetadata() {
	const props = await loadData('home');
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
					<Curve>
						<Menu />
						{children}
						<Footer />
					</Curve>
				</Provider>
				<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
				<svg className="grainy__filter pointer-events-none absolute cursor-none">
					<filter id="grainy">
						<feTurbulence type="turbulence" baseFrequency="0.5"></feTurbulence>
						<feColorMatrix type="saturate" values="0"></feColorMatrix>
					</filter>
				</svg>
			</body>
		</html>
	);
}

RootLayout.propTypes = {
	children: PropTypes.object.isRequired,
};
