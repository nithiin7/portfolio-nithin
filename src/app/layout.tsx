import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata } from 'next';

import loadData from 'helpers/contentful';

import 'styles/globals.scss';

import Provider from './provider';
import Footer from 'components/layouts/Footer';
import Curve from './transition';
import Menu from 'components/layouts/Menu/Menu';

export async function generateMetadata(): Promise<Metadata> {
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

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
	return (
		<html lang="en">
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />
			</head>
			<body>
				<Provider>
					<Curve>
						<Menu />
						{children}
						<Footer />
					</Curve>
				</Provider>
				<GoogleAnalytics
					gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string}
				/>
				<svg className="grainy__filter pointer-events-none absolute cursor-none">
					<filter id="grainy">
						<feTurbulence type="turbulence" baseFrequency="0.5" />
						<feColorMatrix type="saturate" values="0" />
					</filter>
				</svg>
			</body>
		</html>
	);
}
