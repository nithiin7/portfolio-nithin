import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Roboto, Familjen_Grotesk } from 'next/font/google';
import Script from 'next/script';

import 'styles/theme.scss';
import 'styles/globals.scss';

import { Footer, Menu } from 'components/layouts';
import {
	ClickSpark,
	CommandPalette,
	FloatingChat,
	Toast,
} from 'components/utilities';
import { loadData } from 'helpers/contentful';

import Provider from './provider';
import Curve from './transition';

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['100', '300', '400', '500', '700', '900'],
	style: ['normal', 'italic'],
	variable: '--font-roboto',
	display: 'swap',
});

const familjenGrotesk = Familjen_Grotesk({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	style: ['normal', 'italic'],
	variable: '--font-familjen-grotesk',
	display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
	const props = await loadData('home');
	const path = props?.data.pageCollection.items[0];

	return {
		metadataBase: new URL('https://portfolio-nithin.vercel.app/'),
		title: {
			default: path.title,
			template: '%s | Nithin Pradeep - Full Stack Developer',
		},
		description: path.description,
		authors: [{ name: 'Nithin Pradeep', url: 'https://github.com/nithiin7' }],
		creator: 'Nithin Pradeep',
		publisher: 'Nithin Pradeep',
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: 'https://portfolio-nithin.vercel.app/',
			title: path.ogtitle,
			description: path.description,
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: 'Nithin Pradeep - Full Stack Developer Portfolio',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: path.ogtitle,
			description: path.description,
			creator: '@nithiin7',
			images: ['/opengraph-image.jpeg'],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		verification: {
			google: 'google6eac2553ee959d3e',
		},
		alternates: {
			canonical: 'https://portfolio-nithin.vercel.app/',
		},
	};
}

const structuredData = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Nithin Pradeep',
	url: 'https://portfolio-nithin.vercel.app/',
	image: 'https://portfolio-nithin.vercel.app/opengraph-image.jpeg',
	jobTitle: 'Full Stack Developer',
	description:
		'Experienced Full Stack Developer specializing in modern web technologies',
	sameAs: [
		'https://github.com/nithiin7',
		'https://www.linkedin.com/in/nithinpradeep/',
		'https://www.instagram.com/__nithiin__/',
		'https://www.twitter.com/_nithiin7/',
		'https://www.linkedin.com/in/nithin-p7/',
	],
	knowsAbout: [
		'React',
		'Next.js',
		'TypeScript',
		'Node.js',
		'Full Stack Development',
		'Web Development',
		'Frontend Development',
		'Backend Development',
	],
	worksFor: {
		'@type': 'Organization',
		name: 'Paytm Payments Bank',
	},
	address: {
		'@type': 'PostalAddress',
		addressCountry: 'IN',
	},
};

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
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link rel="dns-prefetch" href="https://www.google-analytics.com" />
				<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
			</head>
			<body className={`${roboto.className} ${familjenGrotesk.className}`}>
				<Script
					id="structured-data"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>
				<Provider>
					<Curve>
						<ClickSpark
							sparkColor="#6b645c"
							sparkSize={10}
							sparkRadius={15}
							sparkCount={8}
							duration={400}
						>
							<Menu />
							{children}
							<Footer />
							<FloatingChat chatbotUrl="https://nithiin7-portfolio-resume.hf.space" />
							<CommandPalette resumeUrl="/resume.pdf" />
							<Toast />
						</ClickSpark>
					</Curve>
				</Provider>
				<svg className="grainy__filter pointer-events-none absolute cursor-none">
					<filter id="grainy">
						<feTurbulence type="turbulence" baseFrequency="0.5" />
						<feColorMatrix type="saturate" values="0" />
					</filter>
				</svg>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
