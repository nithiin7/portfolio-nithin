import { GoogleTagManager } from '@next/third-parties/google';
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

import Provider from './provider';
import Curve from './transition';

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['300', '400', '500', '700'],
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

const title =
	'Nithin Pradeep - AI Innovator & Software Engineer | Building Intelligent Digital Experiences';
const description =
	'AI innovator, full-stack developer, and automation engineer. Engineer of intelligent solutions using Next.js, Node.js, Docker, n8n, and AI/ML platforms.';

export const metadata: Metadata = {
	metadataBase: new URL('https://portfolio-nithin.vercel.app/'),
	title: {
		default: title,
		template: '%s | Nithin Pradeep - Full Stack Developer',
	},
	description,
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
		title,
		description,
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
		title,
		description,
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
		types: {
			'application/rss+xml': 'https://portfolio-nithin.vercel.app/feed.xml',
		},
	},
};

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
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="preconnect"
					href="https://images.ctfassets.net"
					crossOrigin="anonymous"
				/>
				<link rel="dns-prefetch" href="https://www.google-analytics.com" />
				<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
			</head>
			<body>
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
				{process.env.NEXT_PUBLIC_GOOGLE_GTM_ID && (
					<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_GTM_ID} />
				)}
			</body>
		</html>
	);
}
