import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import {
	Instrument_Serif,
	Inter_Tight,
	JetBrains_Mono,
} from 'next/font/google';
import Script from 'next/script';

import 'styles/tokens.scss';
import 'styles/globals.scss';

import {
	Footer,
	Navbar,
	PageTransition,
	Preloader,
	preloaderScript,
} from 'components/layouts';
import {
	CommandPalette,
	FloatingChat,
	GridOverlay,
	SkipLink,
	Toast,
} from 'components/utilities';
import { absoluteUrl, personJsonLd, siteConfig } from 'config/site';
import { loadBlogPosts, loadPortfolioSearchItems } from 'helpers/contentful';
import { palette } from 'styles/tokens';

import Provider from './provider';

export const revalidate = 3600;

const interTight = Inter_Tight({
	subsets: ['latin'],
	variable: '--font-inter-tight',
	display: 'swap',
});

const instrumentSerif = Instrument_Serif({
	subsets: ['latin'],
	weight: '400',
	style: ['normal', 'italic'],
	variable: '--font-instrument-serif',
	display: 'swap',
	preload: false,
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono',
	display: 'swap',
	preload: false,
});

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: palette.ink,
};

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: siteConfig.titleTemplate,
	},
	description: siteConfig.description,
	authors: [{ name: siteConfig.name, url: siteConfig.socials.github }],
	creator: siteConfig.name,
	publisher: siteConfig.name,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: absoluteUrl(),
		title: siteConfig.title,
		description: siteConfig.description,
		siteName: siteConfig.siteName,
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.title,
		description: siteConfig.description,
		creator: siteConfig.twitterHandle,
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
		google: siteConfig.googleSiteVerification,
	},
	alternates: {
		canonical: absoluteUrl(),
		types: {
			'application/rss+xml': siteConfig.rssUrl,
		},
	},
	other: {
		'msapplication-TileColor': palette.ink,
	},
};

const structuredData = {
	'@context': 'https://schema.org',
	...personJsonLd,
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({
	children,
}: Readonly<RootLayoutProps>): Promise<React.ReactElement> {
	const [blogData, portfolioItems] = await Promise.all([
		loadBlogPosts(100, 0),
		loadPortfolioSearchItems(),
	]);

	const blogSearchItems = (blogData.data?.blogPostCollection?.items ?? []).map(
		(post) => ({ title: post.title, slug: post.slug })
	);

	return (
		<html
			lang="en"
			className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
			data-theme="dark"
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
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
				<Preloader />
				<SkipLink targetId="main-content" />
				<Provider>
					<Navbar />
					<main id="main-content" tabIndex={-1}>
						<PageTransition>{children}</PageTransition>
					</main>
					<Footer />
					<FloatingChat chatbotUrl="https://nithiin7-portfolio-resume.hf.space" />
					<CommandPalette
						resumeUrl="/resume.pdf"
						blogPosts={blogSearchItems}
						portfolioItems={portfolioItems}
					/>
					<Toast />
					{process.env.NODE_ENV === 'development' && <GridOverlay />}
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
