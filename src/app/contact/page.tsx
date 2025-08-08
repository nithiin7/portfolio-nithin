import type { Metadata } from 'next';
import Script from 'next/script';

import { Contact } from 'components/pages';
import { loadData } from 'helpers/contentful';

export async function generateMetadata(): Promise<Metadata> {
	const props = await loadData('contact');
	const path = props?.data.pageCollection.items[0];

	return {
		title: path.title,
		description: path.description,
		keywords: path.keywords,
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: 'https://portfolio-nithin.vercel.app/contact',
			title: path.title,
			description: path.description,
			siteName: 'Nithin Pradeep - Portfolio',
			images: [
				{
					url: '/opengraph-image.jpeg',
					width: 1200,
					height: 630,
					alt: 'Contact Nithin Pradeep - Full Stack Developer',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: path.title,
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
		alternates: {
			canonical: 'https://portfolio-nithin.vercel.app/contact',
		},
	};
}

const contactStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'ContactPage',
	name: 'Contact Nithin Pradeep',
	description:
		'Get in touch with Nithin Pradeep for web development projects and collaborations',
	url: 'https://portfolio-nithin.vercel.app/contact',
	mainEntity: {
		'@type': 'Person',
		name: 'Nithin Pradeep',
		jobTitle: 'Full Stack Developer',
		url: 'https://portfolio-nithin.vercel.app/',
		sameAs: [
			'https://github.com/nithiin7',
			'https://www.linkedin.com/in/nithin-p7/',
			'https://www.instagram.com/__nithiin__/',
			'https://www.twitter.com/_nithiin7/',
		],
	},
	breadcrumb: {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: 'https://portfolio-nithin.vercel.app/',
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Contact',
				item: 'https://portfolio-nithin.vercel.app/contact',
			},
		],
	},
};

export default function ContactPage(): React.ReactElement {
	return (
		<>
			<Script
				id="contact-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(contactStructuredData),
				}}
			/>
			<Contact />
		</>
	);
}
