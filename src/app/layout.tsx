import type { Metadata, Viewport } from 'next';
import {
	Instrument_Serif,
	Inter_Tight,
	JetBrains_Mono,
} from 'next/font/google';

import 'styles/tokens.scss';
import 'styles/globals.scss';

import Footer from 'components/layouts/Footer/Footer';
import Navbar from 'components/layouts/Navbar/Navbar';
import PageTransition from 'components/layouts/PageTransition/PageTransition';
import Preloader, {
	preloaderScript,
} from 'components/layouts/Preloader/Preloader';
import CommandPalette from 'components/utilities/CommandPalette/CommandPaletteLazy';
import ConsentBanner from 'components/utilities/ConsentBanner/ConsentBannerLazy';
import ConsentScripts from 'components/utilities/ConsentScripts/ConsentScripts';
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
import { ConsentProvider } from 'contexts/ConsentContext';
import { SiteSettingsProvider } from 'contexts/SiteSettingsContext';
import { consentScript } from 'helpers/consent';
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

interface RootLayoutProps {
	children: React.ReactNode;
}

/** Root layout: fonts, theme, chrome, providers and analytics. */
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
				<script dangerouslySetInnerHTML={{ __html: consentScript }} />
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
						<ConsentProvider>
							<Navbar />
							<main id="main-content" tabIndex={-1}>
								<PageTransition>{children}</PageTransition>
							</main>
							<Footer site={site} />
							<FloatingChat chatbotUrl="https://nithiin7-portfolio-resume.hf.space" />
							<CommandPalette resumeUrl="/resume.pdf" />
							<Toast />
							<ConsentBanner />
							<ConsentScripts
								gtmId={gtmId}
								vercel={Boolean(process.env.VERCEL)}
							/>
							{process.env.NODE_ENV === 'development' && <GridOverlay />}
						</ConsentProvider>
					</Provider>
				</SiteSettingsProvider>
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
