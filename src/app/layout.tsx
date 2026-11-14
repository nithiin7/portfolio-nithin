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

import Footer from 'components/layouts/Footer/Footer';
import Navbar from 'components/layouts/Navbar/Navbar';
import PageTransition from 'components/layouts/PageTransition/PageTransition';
import Preloader, {
	preloaderScript,
} from 'components/layouts/Preloader/Preloader';
import CommandPalette from 'components/utilities/CommandPalette/CommandPaletteLazy';
import FloatingChat from 'components/utilities/FloatingChat/FloatingChatLazy';
import GridOverlay from 'components/utilities/GridOverlay/GridOverlay';
import JsonLd from 'components/utilities/JsonLd/JsonLd';
import SkipLink from 'components/utilities/SkipLink/SkipLink';
import Toast from 'components/utilities/Toast/ToastLazy';
import {
	absoluteUrl,
	personJsonLd,
	siteConfig,
	siteName,
	socialUrl,
	titleTemplate,
} from 'config/site';
import { SiteSettingsProvider } from 'contexts/SiteSettingsContext';
import { loadSiteSettings } from 'helpers/contentful';
import { clientEnv } from 'helpers/env';
import { themeScript } from 'helpers/theme';
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
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-jetbrains-mono',
	display: 'swap',
	preload: false,
});

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	themeColor: palette.ink,
};

export async function generateMetadata(): Promise<Metadata> {
	const site = await loadSiteSettings();
	const { title, description } = site.seo;
	return {
		metadataBase: new URL(siteConfig.url),
		title: {
			default: title,
			template: titleTemplate(site),
		},
		description,
		authors: [{ name: site.name, url: socialUrl(site, 'github') }],
		creator: site.name,
		publisher: site.name,
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: absoluteUrl(),
			title: title,
			description,
			siteName: siteName(site),
		},
		twitter: {
			card: 'summary_large_image',
			title: title,
			description,
			creator: site.twitterHandle,
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
}

const gtmSnippet = (id: string): string =>
	`(function(w,d,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;d.head.appendChild(j);})(window,document,'dataLayer','${id}');`;

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({
	children,
}: Readonly<RootLayoutProps>): Promise<React.ReactElement> {
	const site = await loadSiteSettings();
	const gtmId = clientEnv.NEXT_PUBLIC_GOOGLE_GTM_ID;
	const structuredData = {
		'@context': 'https://schema.org',
		...personJsonLd(site),
	};

	return (
		<html
			lang="en"
			className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
			data-theme="dark"
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
				<JsonLd id="structured-data" data={structuredData} />
				<Preloader site={site} />
				<SkipLink targetId="main-content" />
				<SiteSettingsProvider value={site}>
					<Provider>
						<Navbar />
						<main id="main-content" tabIndex={-1}>
							<PageTransition>{children}</PageTransition>
						</main>
						<Footer site={site} />
						<FloatingChat chatbotUrl="https://nithiin7-portfolio-resume.hf.space" />
						<CommandPalette resumeUrl="/resume.pdf" />
						<Toast />
						{process.env.NODE_ENV === 'development' && <GridOverlay />}
					</Provider>
				</SiteSettingsProvider>
				<svg className="grainy__filter pointer-events-none absolute cursor-none">
					<filter id="grainy">
						<feTurbulence type="turbulence" baseFrequency="0.5" />
						<feColorMatrix type="saturate" values="0" />
					</filter>
				</svg>
				{/* The /_vercel/* endpoints only exist on Vercel; elsewhere they 404 */}
				{process.env.VERCEL && (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				)}
				{gtmId && (
					// lazyOnload keeps the 120 KB container off the critical path
					<Script id="gtm" strategy="lazyOnload">
						{gtmSnippet(gtmId)}
					</Script>
				)}
			</body>
		</html>
	);
}
