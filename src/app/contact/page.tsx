import type { Metadata } from 'next';

import Contact from 'components/pages/contact/Contact/Contact';
import JsonLd from 'components/utilities/JsonLd/JsonLd';
import { absoluteUrl, personJsonLd, siteName } from 'config/site';
import { loadPageSeo, loadSiteSettings } from 'helpers/contentful';

export const revalidate = 3600;

const url = absoluteUrl('/contact');

export async function generateMetadata(): Promise<Metadata> {
	const [seo, site] = await Promise.all([
		loadPageSeo('contact'),
		loadSiteSettings(),
	]);
	const { title, description } = seo ?? site.seo;

	return {
		title,
		description,
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url,
			title,
			description,
			siteName: siteName(site),
		},
		twitter: {
			card: 'summary_large_image',
			title,
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
		alternates: { canonical: url },
	};
}

/** Contact route. */
export default async function ContactPage(): Promise<React.ReactElement> {
	const [seo, site] = await Promise.all([
		loadPageSeo('contact'),
		loadSiteSettings(),
	]);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		name: `Contact ${site.name}`,
		description: (seo ?? site.seo).description,
		url,
		mainEntity: personJsonLd(site),
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl() },
				{ '@type': 'ListItem', position: 2, name: 'Contact', item: url },
			],
		},
	};

	return (
		<>
			<JsonLd id="contact-structured-data" data={structuredData} />
			<Contact site={site} />
		</>
	);
}
