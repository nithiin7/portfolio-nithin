import { ReactElement, ReactNode } from 'react';
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
		metadataBase: new URL('https://portfolio-nithin.vercel.app/'),
		title: path.title,
		description: path.description,
		keywords: path.keywords,
		openGraph: {
			title: path.ogtitle,
			description: path.description,
		},
		twitter: {
			card: 'summary_large_image',
			title: path.ogtitle,
			description: path.description,
		},
		robots: {
			index: true,
			follow: true,
		},
		authors: [{ name: 'Nithin', url: 'https://github.com/nithiin7' }],
	};
}

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({
	children,
}: Readonly<RootLayoutProps>): ReactElement {
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
				<link
					rel="preload"
					href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
					as="style"
				/>
				<link
					rel="preload"
					href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&display=swap"
					as="style"
				/>
				<noscript>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&display=swap"
					/>
				</noscript>
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
