import type { Metadata } from 'next';
import { Roboto, Familjen_Grotesk } from 'next/font/google';

import 'styles/theme.scss';
import 'styles/globals.scss';

import Footer from 'components/layouts/Footer';
import Menu from 'components/layouts/Menu';
import loadData from 'helpers/contentful';

import Provider from './provider';
import Curve from './transition';

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['100', '300', '400', '500', '700', '900'],
	style: ['normal', 'italic'],
	variable: '--font-roboto',
});

const familjenGrotesk = Familjen_Grotesk({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	style: ['normal', 'italic'],
	variable: '--font-familjen-grotesk',
});

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
	children: React.ReactNode;
}

export default function RootLayout({
	children,
}: Readonly<RootLayoutProps>): React.ReactElement {
	return (
		<html
			lang="en"
			className={`${roboto.variable} ${familjenGrotesk.variable}`}
			data-theme="dark"
		>
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
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
			</head>
			<body className={`${roboto.className} ${familjenGrotesk.className}`}>
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
